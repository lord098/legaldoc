// src/pages/Upload.tsx

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner'; // You'll need this for user feedback
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

// Define the shape of the document object returned from the backend
// This interface is important for type safety
interface Document {
  id: string;
  fileName: string;
  fileReference: string;
  status: 'ANALYZED';
  mimeType: string;
  extractedText: string;
  summary: string;
  keyValuePairs: Record<string, unknown>;
}

const Upload = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setUploadedFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
        }
    };

    // This is the key change: a real API call to the backend
    const handleAnalyze = async () => {
        if (!uploadedFile) {
            toast.error('No file selected.');
            return;
        }

        setIsUploading(true);
        
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            // Send the file to your backend's upload endpoint
            const response = await fetch('http://localhost:3001/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // If the backend returns a non-200 status, handle the error
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed with an unknown error.');
            }

            // Parse the JSON response from the backend
            const data: { document: Document } = await response.json();
            
            // Show a success message and log the processed document data
            toast.success('Document uploaded and analyzed successfully!');
            console.log('Processed Document:', data.document);

            // You can now use the `data.document.id` or other info to navigate
            // to the chat page, possibly passing the document ID as a URL parameter
            navigate(`/chat?docId=${data.document.id}`);

        } catch (error) {
            console.error('Upload Error:', error);
            // Show a user-friendly error message
            if (error instanceof Error) {
                toast.error(`Failed to upload file: ${error.message}`);
            } else {
                toast.error('Failed to upload file. Please try again.');
            }
        } finally {
            // Always set isUploading to false, regardless of success or failure
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen subtle-gradient">
            <Navbar />
            
            <main className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl font-bold text-foreground mb-4"
                        >
                            Upload Legal Document
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-muted-foreground text-lg"
                        >
                            Upload a PDF document to get started with AI-powered analysis
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <Card className="glass-card border-2 border-dashed transition-all duration-300 hover:shadow-lg">
                            <CardContent className="p-8">
                                {!uploadedFile ? (
                                    <motion.div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`text-center p-12 rounded-xl transition-all duration-300 ${
                                            isDragging 
                                                ? 'bg-accent/20 border-2 border-accent border-dashed scale-105' 
                                                : 'hover:bg-muted/30'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                                    >
                                        <motion.div
                                            animate={isDragging ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="mx-auto w-fit p-6 bg-primary/20 rounded-full mb-6"
                                        >
                                            <UploadIcon className="h-12 w-12 text-primary" />
                                        </motion.div>
                                        
                                        <h3 className="text-xl font-semibold mb-2">
                                            {isDragging ? 'Drop your PDF here!' : 'Drag & Drop PDF'}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            Or click to browse and select a file
                                        </p>
                                        
                                        <div className="space-y-4">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <Button
                                                asChild
                                                className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                                            >
                                                <label htmlFor="file-upload" className="cursor-pointer">
                                                    Browse Files
                                                </label>
                                            </Button>
                                            
                                            <p className="text-sm text-muted-foreground">
                                                Supported format: PDF (max 10MB)
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center space-y-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="mx-auto w-fit p-4 bg-green-500/20 rounded-full"
                                        >
                                            <CheckCircle className="h-12 w-12 text-green-600" />
                                        </motion.div>
                                        
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">File Uploaded Successfully!</h3>
                                            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                                <span>{uploadedFile.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <div className="flex gap-4 justify-center">
                                            <Button
                                                onClick={() => setUploadedFile(null)}
                                                variant="outline"
                                                className="hover:scale-105 transition-all duration-300"
                                            >
                                                Upload Different File
                                            </Button>
                                            
                                            <Button
                                                onClick={handleAnalyze}
                                                disabled={isUploading}
                                                className="bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 group"
                                            >
                                                {isUploading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="h-4 w-4 border-2 border-white/30 border-t-black rounded-full mr-2"
                                                    />
                                                ) : (
                                                    <>
                                                        Analyze Document
                                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Information Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="grid md:grid-cols-2 gap-6 mt-8"
                    >
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="text-lg">What happens next?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• AI analyzes your document structure</li>
                                    <li>• Complex legal terms are identified</li>
                                    <li>• Plain English explanations are prepared</li>
                                    <li>• Ready for interactive Q&A</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="text-lg">Privacy & Security</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• End-to-end encryption</li>
                                    <li>• No data stored permanently</li>
                                    <li>• GDPR compliant processing</li>
                                    <li>• Your documents remain private</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}

export default Upload;