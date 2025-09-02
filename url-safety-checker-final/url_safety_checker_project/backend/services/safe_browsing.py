import os
import requests
import logging

logger = logging.getLogger(__name__)

def check_google_safebrowsing(url):
    """
    Check URL against Google Safe Browsing API
    Returns dict with matches or error information
    """
    try:
        api_key = os.getenv("GSB_API_KEY")
        if not api_key:
            logger.warning("Google Safe Browsing API key not found")
            return {"error": "API key not configured"}
        
        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
        
        payload = {
            "client": {
                "clientId": "url-safety-checker",
                "clientVersion": "1.0.0"
            },
            "threatInfo": {
                "threatTypes": [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE",
                    "POTENTIALLY_HARMFUL_APPLICATION"
                ],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        
        logger.info(f"Checking URL with Google Safe Browsing: {url}")
        response = requests.post(
            endpoint, 
            json=payload, 
            timeout=15,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            matches = result.get("matches", [])
            logger.info(f"Google Safe Browsing check completed: {len(matches)} threats found")
            return result if result else {"matches": []}
        else:
            logger.error(f"Google Safe Browsing API error: {response.status_code} - {response.text}")
            return {"error": f"API request failed: {response.status_code}"}
            
    except requests.exceptions.Timeout:
        logger.error("Google Safe Browsing API timeout")
        return {"error": "Request timeout"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Google Safe Browsing API request error: {str(e)}")
        return {"error": "Network error"}
    except Exception as e:
        logger.error(f"Unexpected error in Google Safe Browsing check: {str(e)}")
        return {"error": "Service unavailable"}
