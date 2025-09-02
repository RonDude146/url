# Project Structure

```
url-safety-checker/
├── backend/                    # Flask backend application
│   ├── services/              # External API integration modules
│   │   ├── safe_browsing.py   # Google Safe Browsing API client
│   │   └── virustotal.py      # VirusTotal API client
│   ├── app.py                 # Main Flask application
│   ├── utils.py               # Utility functions and helpers
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Environment variables (create this)
├── frontend/                  # Frontend web interface
│   └── index.html            # Main application interface
├── docs/                     # Documentation and diagrams
│   ├── architecture.png      # System architecture diagram
│   ├── workflow.png          # Application workflow diagram
│   ├── project-banner.png    # Project banner image
│   ├── security-concept.png  # Security concept illustration
│   └── presentation/         # Presentation slides
│       ├── title_slide.html
│       ├── project_overview.html
│       ├── features.html
│       ├── tech_stack.html
│       ├── architecture.html
│       ├── workflow.html
│       ├── implementation.html
│       ├── demo.html
│       ├── conclusion.html
│       └── q_and_a.html
├── screenshots/              # Application screenshots
│   └── main-interface.png    # Main application interface
├── README.md                 # Comprehensive documentation
├── INSTALLATION.md           # Quick installation guide
├── PROJECT_STRUCTURE.md      # This file
└── LICENSE                   # MIT license
```

## Key Files Description

### Backend Components
- **app.py**: Main Flask application with routes and error handling
- **utils.py**: URL validation, normalization, and result classification
- **services/**: API integration modules with error handling and logging

### Frontend Components
- **index.html**: Complete single-page application with modern UI

### Documentation
- **README.md**: Comprehensive project documentation
- **docs/**: Visual assets, diagrams, and presentation materials

## Getting Started
1. Read INSTALLATION.md for quick setup
2. See README.md for comprehensive documentation
3. View presentation slides in docs/presentation/
4. Check screenshots/ for application examples

