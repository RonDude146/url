# Quick Installation Guide

## Prerequisites
- Python 3.8+
- Web browser
- Internet connection

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure API Keys**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Start the Application**
   ```bash
   python app.py
   ```

4. **Open Frontend**
   - Open `frontend/index.html` in your browser
   - Or visit `http://localhost:5000`

## API Keys Required
- Google Safe Browsing API: https://developers.google.com/safe-browsing/v4/get-started
- VirusTotal API: https://www.virustotal.com/gui/my-apikey

## Test URLs
- Safe: `https://google.com`
- Test malware: `http://malware.testing.google.test/testing/malware/`

For detailed documentation, see README.md

