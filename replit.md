# URL Safety Checker

## Overview

The URL Safety Checker is a full-stack web application designed to help users identify potentially malicious websites before visiting them. This college project demonstrates modern web development practices by integrating with two industry-leading security APIs - Google Safe Browsing and VirusTotal - to provide comprehensive threat detection and analysis.

The application features a clean, responsive web interface built with TailwindCSS and a robust Flask REST API backend. Users can input URLs to receive real-time safety assessments with detailed threat categorization (Safe, Suspicious, Malicious, Unknown) and technical analysis results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-page application** built with vanilla HTML5, CSS3, and JavaScript
- **TailwindCSS** for utility-first styling and responsive design
- **Font Awesome** for iconography and visual elements
- **Glass morphism design** with gradient backgrounds and modern UI elements
- **Real-time status updates** with loading states and progress indicators

### Backend Architecture
- **Flask REST API** serving as the main application server
- **Service layer pattern** with separate modules for external API integrations
- **CORS middleware** enabled for cross-origin requests from frontend
- **Comprehensive logging system** for debugging and monitoring
- **Environment-based configuration** for secure API key management
- **Health check endpoints** for service monitoring

### API Integration Layer
- **Google Safe Browsing service** module handling threat detection API calls
- **VirusTotal service** module managing URL analysis and reporting
- **Utility functions** for URL validation, normalization, and result classification
- **Error handling and retry logic** for robust external API communication
- **Parallel API calls** to minimize response times

### Security and Validation
- **Input validation** using regex patterns and URL parsing
- **URL normalization** to handle various input formats
- **Secure API key storage** using environment variables
- **Request timeouts** and error boundaries for reliability

### Classification System
- **Multi-source threat analysis** combining results from both security APIs
- **Intelligent result classification** based on threat type and severity
- **Detailed reporting** with technical details and confidence indicators

## External Dependencies

### Security APIs
- **Google Safe Browsing API v4** - Primary threat detection service for malware, social engineering, unwanted software, and potentially harmful applications
- **VirusTotal API v3** - Secondary analysis service providing detailed URL scanning and reputation data

### Backend Dependencies
- **Flask 2.3.2** - Lightweight Python web framework for REST API development
- **Flask-CORS 4.0.0** - Cross-Origin Resource Sharing support for frontend integration
- **Requests 2.31.0** - HTTP library for external API communications
- **Python-dotenv 1.0.0** - Environment variable management for configuration

### Frontend Dependencies
- **TailwindCSS 3.3.0** - Utility-first CSS framework delivered via CDN
- **Font Awesome 6.4.0** - Icon library for UI elements delivered via CDN

### Runtime Environment
- **Python 3.8+** - Required runtime for backend application
- **Modern web browser** - For frontend interface (Chrome, Firefox, Safari, Edge)

### Configuration Requirements
- **Google Safe Browsing API key** - Required for threat detection functionality
- **VirusTotal API key** - Required for URL analysis features
- **Environment variables** - Secure storage of API credentials and configuration