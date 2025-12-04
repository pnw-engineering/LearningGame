# Addition Game

An educational addition game featuring intelligent problem selection, adaptive learning, theme system, and DEV-GUIDELINES compliant development. Built with Python backend and standard web technologies for the frontend.

## 🏗️ Project Structure

```text
Addition/
├── index-dev.html         # Development HTML file
├── index.html             # Production HTML file
// ...existing code...
├── manifest.json          # PWA manifest
├── sw.js.disabled         # Service worker (disabled)
├── css/
│   └── main.css           # Main stylesheet with theme system
├── js/
│   ├── main.js            # Main game logic with intelligent selection
│   ├── api.js             # API communication
│   ├── init.js            # Initialization logic
│   ├── storage.js         # Storage management
│   └── simple-storage.js  # Simplified storage
├── icons/                 # PWA icons
├── images/                # Image assets
├── test-hint.html         # Hint testing page
├── test-mode-button.html  # Mode button test page
├── backend/               # Python backend (minimal)
│   ├── app.py             # Main Flask application
│   ├── config/
│   │   └── settings.py    # Application configuration
│   └── api/, models/, utils/ # Backend structure (minimal)
├── _resources/            # Development resources
├── static/                # Static files
├── DEV-GUIDELINES.md      # Development guidelines
├── QUICK-REF.md           # Quick reference
├── requirements.txt       # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- A modern web browser that supports PWAs

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd "c:\Users\Rick\OneDrive\Programming\Addition"
   ```

2. **Run a local static server (e.g. GoLive in VS Code):**

   - Open the project folder in VS Code
   - Start GoLive (or any static server extension)

3. **Open your browser and navigate to:**

   ```text
   http://localhost:8000
   ```

## ✨ Features

- **Intelligent Problem Selection**: Error-aware balanced combination selection using tries-errors success scoring
- **Adaptive Learning**: Bidirectional error tracking that adapts to user performance
- **Theme System**: Light, dark, and auto (system) theme switching
- **Auto-Test Mode**: Rapid iteration testing with 10% error rate for algorithm validation
- **game-Based Learning**: Multiple difficulty games with different learning objectives
- **DEV-GUIDELINES Compliant**: Follows strict development guidelines for maintainable code
- **Layout Stability**: Fixed-height containers preventing screen jumping
- **Integrated Settings**: Welcome screen settings with auto-save functionality

## 🔧 Development

The frontend is a standard PWA using:

- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for functionality
- Service Worker for offline capabilities

Key files:

- `index.html`: Main application page
- `js/main.js`: Application logic
- `js/api.js`: Backend communication
- `sw.js.disabled`: Service worker (disabled)
- `manifest.json`: PWA configuration

// ...existing code...

## 🛠️ Customization

### Adding New Operations

1. Update `backend/models/calculator.py` with new operation
2. Update validation in `backend/utils/validators.py`
3. Add frontend interface in `frontend/js/main.js`

### Styling

- Modify `css/main.css` for appearance changes
- Update `manifest.json` for PWA settings

### Icons

Add PWA icons in various sizes to `icons/`:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## 🔒 Security

- Input validation on both frontend and backend
- CORS configuration for cross-origin requests
- Sanitization of user inputs
- Error handling to prevent information disclosure

// ...existing code...

## � Deployment

You can deploy the static site to GitHub Pages or any static hosting provider. No backend server is required for the core game.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. Add your preferred license here.

## 🆘 Troubleshooting

### Common Issues

1. **PWA not installing**: Check that you're serving over HTTPS or localhost
2. **API errors**: Check browser console for JavaScript errors

### Getting Help

- Check the browser console for JavaScript errors
- Review Python logs for backend issues
- Ensure all dependencies are properly installed
- Verify file permissions for the data directory
