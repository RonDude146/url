from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from services.safe_browsing import check_google_safebrowsing
from services.virustotal import check_virustotal
from utils import normalize_url, classify_results, validate_url
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def serve_frontend():
    """Serve the frontend HTML file"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    })

@app.route('/check', methods=['POST'])
def check_url():
    """Check URL safety using multiple security services"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        url = data.get("url", "").strip()
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        # Validate URL format
        if not validate_url(url):
            return jsonify({"error": "Invalid URL format"}), 400
        
        # Normalize URL
        normalized_url = normalize_url(url)
        logger.info(f"Checking URL: {normalized_url}")
        
        # Check with security services
        google_result = check_google_safebrowsing(normalized_url)
        vt_result = check_virustotal(normalized_url)
        
        # Classify results
        status, reason = classify_results(google_result, vt_result)
        
        response = {
            "url": normalized_url,
            "status": status,
            "reason": reason,
            "details": {
                "google_safebrowsing": google_result,
                "virustotal": vt_result,
                "checked_at": datetime.utcnow().isoformat()
            }
        }
        
        logger.info(f"URL check completed: {status}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error checking URL: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "Unable to process URL check request"
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    # Check for required environment variables
    required_vars = ["GSB_API_KEY", "VIRUSTOTAL_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.warning(f"Missing environment variables: {', '.join(missing_vars)}")
        logger.warning("Please check your .env file. Using .env.example as reference.")
    
    logger.info("Starting URL Safety Checker API server...")
    app.run(host="0.0.0.0", port=5000, debug=True)
