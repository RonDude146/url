import re
from urllib.parse import urlparse

def validate_url(url):
    """Validate URL format using regex and urllib"""
    try:
        # Basic URL pattern validation
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        # Check if URL matches pattern
        if not url_pattern.match(url):
            # Try with protocol prefix
            if not url.startswith(('http://', 'https://')):
                test_url = 'http://' + url
                if url_pattern.match(test_url):
                    return True
            return False
        
        # Additional validation using urlparse
        parsed = urlparse(url)
        return bool(parsed.netloc and parsed.scheme in ['http', 'https'])
        
    except Exception:
        return False

def normalize_url(url):
    """Normalize URL by adding protocol if missing"""
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    return url.strip()

def classify_results(gsb_result, vt_result):
    """Classify URL safety based on Google Safe Browsing and VirusTotal results"""
    try:
        # Handle Google Safe Browsing results
        gsb_threats = gsb_result.get("matches", []) if not gsb_result.get("error") else []
        
        # Handle VirusTotal results
        vt_stats = {}
        if not vt_result.get("error"):
            vt_data = vt_result.get("data", {})
            if isinstance(vt_data, dict):
                vt_stats = vt_data.get("attributes", {}).get("stats", {})
        
        malicious_count = vt_stats.get("malicious", 0)
        suspicious_count = vt_stats.get("suspicious", 0)
        
        # Classification logic
        if gsb_threats or malicious_count > 2:
            return "malicious", "Multiple security threats detected"
        elif malicious_count > 0 or suspicious_count > 0:
            threat_count = malicious_count + suspicious_count
            return "suspicious", f"Potential threats detected ({threat_count} detections)"
        elif not gsb_result.get("error") and not vt_result.get("error"):
            return "safe", "No threats detected by security services"
        else:
            return "unknown", "Unable to verify - service errors encountered"
            
    except Exception as e:
        return "unknown", f"Error analyzing results: {str(e)}"

def format_scan_details(gsb_result, vt_result):
    """Format detailed scan results for display"""
    details = {
        "google_safe_browsing": {
            "status": "error" if gsb_result.get("error") else "success",
            "threats_found": len(gsb_result.get("matches", [])),
            "threat_types": [match.get("threatType") for match in gsb_result.get("matches", [])]
        },
        "virustotal": {
            "status": "error" if vt_result.get("error") else "success",
            "stats": vt_result.get("data", {}).get("attributes", {}).get("stats", {}) if not vt_result.get("error") else {}
        }
    }
    return details
