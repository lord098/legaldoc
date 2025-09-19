// To run this server, you need to install the following packages:
// npm install express bcrypt mongoose cors multer path pdf-parse mammoth @xenova/transformers dotenv

const express = require('express');
const bcrypt = require('bcrypt');
const Multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs/promises');
const { spawn } = require('child_process');
const pdf = require('pdf-parse'); // For PDF file processing
const mammoth = require('mammoth'); // For DOCX file processing
const { pipeline } = require('@xenova/transformers');
require('dotenv').config();

// --- Connect to MongoDB Database ---
const mongoose = require('mongoose');

// The MongoDB connection URI should ideally be in a .env file for security.
// For this example, we'll hardcode it as per your request.
const mongoURI = "mongodb+srv://aunjsingh351_db_user:e1Iffb3AcoTR5u0L@fronted.xuszlo3.mongodb.net/?retryWrites=true&w=majority&appName=Fronted";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose User Model ---
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const User = mongoose.model('User', userSchema);

// --- Caching the pipelines to avoid re-initializing on every request ---
const summarizationPipeline = pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
const explanationPipeline = pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');

// 2. Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;

// --- Local Storage Path for document data and uploaded files ---
const DOCUMENTS_FILE = path.join(__dirname, 'documents.json');
const UPLOADS_DIR = 'uploads/';

// --- Ensure uploads directory exists ---
fs.mkdir(UPLOADS_DIR, { recursive: true }).catch(console.error);

// 3. Configure Multer's Disk Storage
const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = Multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
});

// --- HELPER FUNCTIONS ---
function isLegalDocument(text) {
    if (!text) return false;
    const lowerCaseText = text.toLowerCase();
    const legalKeywords = [
        'agreement', 'contract', 'affidavit', 'plaintiff', 'defendant', 'court',
        'judge', 'jurisdiction', 'whereas', 'heretofore', 'indemnify', 'liability',
        'lease', 'terms and conditions', 'governed by the laws of', 'article',
        'section', 'clause', 'party', 'parties', 'provision', 'income certificate',
        'annual income', 'gross income', 'net income', 'financial year', 'assessment year',
        'revenue department', 'tahsildar', 'magistrate', 'issuing authority', 'verified',
        'certified that', 'salary', 'rupees', 'pension', 'seal', 'stamp', 'समझौता', 
        'अनुबंध', 'शपथ पत्र', 'वादी', ' प्रतिवादी', 'न्यायालय', 'अदालत', 'न्यायाधीश', 
        'क्षेत्राधिकार', 'जबकि', 'क्षतिपूर्ति', 'दायित्व', 'पट्टा', 'नियम और शर्तें', 
        'कानूनों द्वारा शासित', 'अनुच्छेद', 'धारा', 'खंड', 'पक्षकार', 'प्रावधान', 
        'आय प्रमाण पत्र', 'वार्षिक आय', 'सकल आय', 'शुद्ध आय', 'वित्तीय वर्ष', 
        'निर्धारण वर्ष', 'राजस्व विभाग', 'तहसीलदार', 'मजिस्ट्रेट', 
        'जारी करने वाला प्राधिकरण', 'सत्यापित', 'प्रमाणित', 'वेतन', 'रुपये', 
        'पेंशन', 'मुहर', 'स्टाम्प',
        'certificate', 'certificate number', 'government', 'ministry', 'department',
        'report', 'official', 'verified by', 'document', 'authority',
        'प्रमाण पत्र', 'संख्या', 'सरकार', 'मंत्रालय', 'विभाग',
        'रिपोर्ट', 'आधिकारिक', 'सत्यापित', 'दस्तावेज़', 'प्राधिकरण'
    ];
    return legalKeywords.some(keyword => lowerCaseText.includes(keyword));
}

async function readDocuments() {
    try {
        const data = await fs.readFile(DOCUMENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read documents file:', err);
        return [];
    }
}

async function writeDocuments(documents) {
    try {
        await fs.writeFile(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
    } catch (err) {
        console.error('Failed to write to documents file:', err);
        throw err;
    }
}

// --- Text extraction for different file types ---
async function extractPdfText(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        return data.text.trim();
    } catch (error) {
        console.error(`Error extracting PDF text: ${error.message}`);
        return null;
    }
}

async function extractDocxText(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value.trim();
    } catch (error) {
        console.error(`Error extracting DOCX text: ${error.message}`);
        return null;
    }
}

async function extractTxtText(filePath) {
    try {
        const text = await fs.readFile(filePath, { encoding: 'utf-8' });
        return text.trim();
    } catch (error) {
        try {
            const text = await fs.readFile(filePath, { encoding: 'latin-1' });
            return text.trim();
        } catch (e) {
            console.error(`Error extracting TXT text: ${e.message}`);
            return null;
        }
    }
}

async function processDocumentWithOcr(filePath) {
    return new Promise((resolve, reject) => {
        const childProcessOptions = {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        };
        const ocrProcess = spawn('python', ['easyocr_script.py', filePath], childProcessOptions);
        let outputData = '';
        let errorData = '';

        ocrProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        ocrProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        ocrProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const parsedData = JSON.parse(outputData);
                    if (parsedData.error) {
                        return reject(new Error('OCR processing failed with error: ' + parsedData.error));
                    }
                    console.log('EasyOCR successful.');
                    resolve({ fullText: parsedData.fullText.trim() });
                } catch (e) {
                    reject(new Error('Failed to parse OCR output.'));
                }
            } else {
                console.error('OCR process exited with code:', code);
                console.error('Error details:', errorData);
                reject(new Error('OCR processing failed.'));
            }
        });
        ocrProcess.on('error', (err) => {
            reject(new Error('Failed to run OCR script: ' + err.message));
        });
    });
}

// Main text extraction function that combines all methods
async function extractTextFromFile(filePath, fileType) {
    const sanitizedFileType = fileType.trim().toLowerCase();
    try {
        if (sanitizedFileType === 'application/pdf') {
            return await extractPdfText(filePath);
        } else if (sanitizedFileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return await extractDocxText(filePath);
        } else if (sanitizedFileType === 'text/plain') {
            return await extractTxtText(filePath);
        } else if (sanitizedFileType.startsWith('image/')) {
            console.log('Attempting OCR for image file...');
            const ocrResult = await processDocumentWithOcr(filePath);
            return ocrResult.fullText;
        } else {
            console.warn(`Unsupported file type: ${sanitizedFileType}`);
            return null;
        }
    } catch (error) {
        console.error(`Error extracting text from ${filePath}: ${error.message}`);
        return null;
    }
}

// --- AI Functions ---
async function summarizeText(text) {
    try {
        const pipe = await summarizationPipeline;
        if (!text || text.trim() === '') {
            throw new Error("Input text is empty. Cannot generate a summary.");
        }
        const input = text.substring(0, 4000);
        const output = await pipe(input);
        if (!output || output.length === 0 || !output[0].summary_text) {
            throw new Error("Summarization pipeline did not return a valid summary.");
        }
        return output[0].summary_text;
    } catch (err) {
        console.error("Summarization failed:", err.message);
        throw new Error("Failed to generate summary after all attempts.");
    }
}

async function simplifyClauses(clause, fullDocumentText) {
    try {
        const pipe = await explanationPipeline;
        if (!clause || !fullDocumentText) {
            throw new Error("Missing clause or document context for simplification.");
        }
        const truncatedContext = fullDocumentText.substring(0, 4000);

        const prompt = `
        You are an expert AI assistant that simplifies legal documents.
        Your task is to rewrite the following legal clause in simple, easy-to-understand language.
        Focus on the most important point of the clause and present it concisely.
        Do not repeat or include any unnecessary information.

        Document Context:
        ${truncatedContext}

        Clause to Simplify:
        ${clause}
        `;

        const output = await pipe(prompt, { max_new_tokens: 200, temperature: 0.5 });
        
        const simplifiedText = output[0].generated_text.replace(prompt, "").trim();
        return simplifiedText;
        
    } catch (error) {
        console.error('Error simplifying legal text:', error);
        return null;
    }
}

// 4. Define API Routes
// --- User Authentication Routes (Now using Mongoose) ---
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user with that email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'An error occurred during signup. Please try again later.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        // Login successful. You would typically create and send a JWT token here.
        res.status(200).json({ message: 'Login successful!', user: { username: user.username, email: user.email } });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
    }
});

// --- Document Processing Routes ---
app.post('/api/documents/upload', upload.single('file'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        console.log('File successfully uploaded and saved:', req.file.path);
        console.log('Starting text extraction...');
        const extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);
        
        if (!extractedText) {
            await fs.unlink(req.file.path);
            return res.status(500).json({ message: 'Failed to extract text from the document.' });
        }
        
        console.log('Text extraction finished.');
        console.log('Extracted Text:', extractedText);

        if (!isLegalDocument(extractedText)) {
            console.warn('Validation failed: Document does not appear to be a legal paper.');
            await fs.unlink(req.file.path);
            return res.status(400).json({
                message: 'Validation failed. The uploaded file does not appear to be a legal document.',
            });
        }
        
        const summary = await summarizeText(extractedText);
        
        const newDocument = {
            id: Date.now().toString(), // Using timestamp as a unique ID
            fileName: req.file.originalname,
            fileReference: req.file.path,
            status: 'ANALYZED',
            mimeType: req.file.mimetype,
            extractedText: extractedText,
            summary: summary,
            keyValuePairs: {},
        };
        
        const documents = await readDocuments();
        documents.push(newDocument);
        await writeDocuments(documents);
        
        console.log('Document metadata saved to local file. ID:', newDocument.id);

        res.status(200).json({
            message: 'File processed and stored successfully.',
            document: newDocument,
        });
    } catch (error) {
        console.error('Error during processing or local save:', error);
        res.status(500).json({ message: 'Failed to process document.', error: error.message });
    }
});

app.post('/api/documents/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Text to summarize not provided in request body." });
        }
        const summary = await summarizeText(text);
        res.json({ message: "Summary generated successfully.", summary });
    } catch (err) {
        console.error("Summary error:", err);
        res.status(500).json({ message: "Failed to generate summary.", error: err.message });
    }
});


// --- Other Routes ---
app.get("/api/documents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const documents = await readDocuments();
        const document = documents.find(doc => doc.id === id);
        
        if (!document) return res.status(404).json({ message: "Document not found." });
        res.json({ document });
    } catch (err) {
        console.error("Fetch document error:", err);
        res.status(500).json({ message: "Failed to fetch document.", error: err.message });
    }
});

app.get("/api/documents", async (req, res) => {
    try {
        const documents = await readDocuments();
        res.json({ documents });
    } catch (err) {
        console.error("Fetch all documents error:", err);
        res.status(500).json({ message: "Failed to fetch documents.", error: err.message });
    }
});

app.post("/api/documents/:id/summarize", async (req, res) => {
    try {
        const { id } = req.params;
        const documents = await readDocuments();
        const document = documents.find(doc => doc.id === id);

        if (!document) return res.status(404).json({ message: "Document not found." });
        const summary = await summarizeText(document.extractedText);
        res.json({ message: "Summary generated successfully.", summary });
    } catch (err) {
        console.error("Summary error:", err);
        res.status(500).json({ message: "Failed to generate summary.", error: err.message });
    }
});

app.post("/api/documents/:id/explain", async (req, res) => {
    try {
        const { id } = req.params;
        const { clause } = req.body;
        
        if (!clause || clause.trim() === '') {
            return res.status(400).json({ message: "Clause not provided in request body." });
        }

        const documents = await readDocuments();
        const document = documents.find(doc => doc.id === id);

        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        const fullDocumentText = document.extractedText;

        if (!fullDocumentText || fullDocumentText.trim() === '') {
            return res.status(400).json({ message: "Document context is empty. Cannot explain clause." });
        }

        const explanation = await simplifyClauses(clause, fullDocumentText);

        if (!explanation) {
            return res.status(500).json({ message: "Failed to generate explanation." });
        }
        
        res.status(200).json({
            message: "Clause explained successfully.",
            explanation: explanation
        });

    } catch (err) {
        console.error("Explain error:", err);
        res.status(500).json({ message: "Failed to explain clause.", error: err.message });
    }
});

app.use((req, res, next) => {
    console.log(`Request received for: ${req.method} ${req.originalUrl}`);
    next();
});

// 5. Start the server
app.listen(port, () => {
    console.log(`Server is running and listening on http://localhost:${port}`);
});