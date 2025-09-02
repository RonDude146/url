import os
import requests
import time
import logging

logger = logging.getLogger(__name__)

def check_virustotal(url):
    """
    Check URL against VirusTotal API
    Returns dict with analysis results or error information
    """
    try:
        api_key = os.getenv("VIRUSTOTAL_API_KEY")
        if not api_key:
            logger.warning("VirusTotal API key not found")
            return {"error": "API key not configured"}
        
        headers = {"x-apikey": api_key}
        
        # Submit URL for analysis
        logger.info(f"Submitting URL to VirusTotal: {url}")
        submit_response = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url},
            timeout=15
        )
        
        if submit_response.status_code != 200:
            logger.error(f"VirusTotal submission error: {submit_response.status_code}")
            return {"error": f"Submission failed: {submit_response.status_code}"}
        
        # Get analysis ID
        submit_data = submit_response.json()
        analysis_id = submit_data.get("data", {}).get("id")
        
        if not analysis_id:
            logger.error("No analysis ID received from VirusTotal")
            return {"error": "No analysis ID received"}
        
        # Wait for analysis to complete (with retry logic)
        max_retries = 3
        retry_delay = 2
        
        for attempt in range(max_retries):
            logger.info(f"Retrieving VirusTotal analysis (attempt {attempt + 1})")
            
            analysis_response = requests.get(
                f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
                headers=headers,
                timeout=15
            )
            
            if analysis_response.status_code == 200:
                analysis_data = analysis_response.json()
                
                # Check if analysis is complete
                status = analysis_data.get("data", {}).get("attributes", {}).get("status")
                
                if status == "completed":
                    stats = analysis_data.get("data", {}).get("attributes", {}).get("stats", {})
                    logger.info(f"VirusTotal analysis completed: {stats}")
                    return analysis_data
                elif status == "queued":
                    if attempt < max_retries - 1:
                        logger.info(f"Analysis queued, waiting {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                        continue
                    else:
                        logger.warning("Analysis still queued after max retries")
                        return {"error": "Analysis timeout - still processing"}
                else:
                    logger.error(f"Unexpected analysis status: {status}")
                    return {"error": f"Analysis failed with status: {status}"}
            else:
                logger.error(f"VirusTotal analysis retrieval error: {analysis_response.status_code}")
                return {"error": f"Analysis retrieval failed: {analysis_response.status_code}"}
        
        return {"error": "Max retries exceeded"}
        
    except requests.exceptions.Timeout:
        logger.error("VirusTotal API timeout")
        return {"error": "Request timeout"}
    except requests.exceptions.RequestException as e:
        logger.error(f"VirusTotal API request error: {str(e)}")
        return {"error": "Network error"}
    except Exception as e:
        logger.error(f"Unexpected error in VirusTotal check: {str(e)}")
        return {"error": "Service unavailable"}
