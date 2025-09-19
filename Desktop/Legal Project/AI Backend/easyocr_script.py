import sys
import json
import easyocr

try:
    # Use a more comprehensive list of languages for better accuracy on Indian documents
    reader = easyocr.Reader(['en','hi'], verbose=False)

    if len(sys.argv) < 2:
        raise ValueError("No image path provided.")
    
    image_path = sys.argv[1]
    
    # Perform OCR
    result = reader.readtext(image_path)
    
    extracted_texts = [item[1] for item in result]
    
    output_data = {
        "fullText": " ".join(extracted_texts)
    }
    
    print(json.dumps(output_data))
    
except Exception as e:
    error_output = json.dumps({"error": str(e)})
    print(error_output, file=sys.stderr)
    sys.exit(1)