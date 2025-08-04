# BugRecon - Advanced Reconnaissance Automation

A modern web application for bug bounty hunters to automate reconnaissance tasks with a beautiful, responsive UI.

## 🚀 Features

- **Subdomain Enumeration**: Discover subdomains using Subfinder
- **URL Discovery**: Find URLs using GAU (Get All URLs)
- **WHOIS Lookup**: Get domain registration information
- **Modern UI**: Dark/Light theme with professional design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Results**: Live scanning with progress indicators
- **Export Functionality**: Download results in various formats

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Axios** for API communication
- **File-saver** for export functionality
- **Modern CSS** with gradients and glassmorphism effects

### Backend
- **FastAPI** (Python)
- **Uvicorn** server
- **CORS** enabled for frontend integration
- **Multiple API integrations** (WhoisXML, VirusTotal, SecurityTrails)

## 🎨 UI Features

- **Dual Theme**: Dark and Light mode with toggle
- **Professional Design**: Modern gradients and colors
- **Responsive Layout**: Mobile-first design
- **Minimizable Results**: Collapsible output panels
- **Smooth Animations**: CSS transitions and effects

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly controls
- **Cross-browser**: Works on all modern browsers

## 🚀 Quick Start

### Frontend
```bash
cd bugrecon-client
npm install
npm start
```

### Backend
```bash
cd bugrecon-backend-python
pip install -r requirements.txt
python app.py
```

## 🌐 Deployment

### Frontend Deployment Options

1. **Vercel** (Recommended)
   - Connect GitHub repository
   - Auto-deploy on push
   - Free hosting with custom domain

2. **Netlify**
   - Drag & drop build folder
   - Continuous deployment
   - Free SSL certificate

3. **GitHub Pages**
   - Push to GitHub
   - Enable GitHub Pages
   - Free hosting

### Backend Deployment Options

1. **Railway** (Recommended)
   - Connect GitHub repository
   - Auto-detect Python
   - Free tier available

2. **Render**
   - Web service deployment
   - Auto-restart on changes
   - Free tier available

3. **Heroku**
   - Container deployment
   - Easy scaling
   - Free tier available

## 🔧 Configuration

### Environment Variables

Backend requires these API keys (optional):
- `WHOIS_API_KEY` - WHOIS XML API
- `VIRUSTOTAL_API_KEY` - VirusTotal API
- `SECURITYTRAILS_API_KEY` - SecurityTrails API

### API Endpoints

- `GET /api/subfinder` - Subdomain enumeration
- `GET /api/gau` - URL discovery
- `GET /api/whois` - WHOIS information
- `POST /api/pyhttpx/scan` - HTTP scanning
- `GET /api/pyhttpx/history` - Scan history

## 📦 Build

```bash
npm run build
```

The build folder is ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built for the bug bounty community
- Inspired by modern reconnaissance tools
- Designed for professional use
