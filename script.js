// Simple Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');

        if (loadingScreen && mainContent) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.5s ease';

                    // Trigger scroll animations
                    triggerScrollAnimations();
                }, 100);
            }, 300);
        }
    }, 1000); // Reduced loading time
});

// Advanced Smooth scrolling function with easing
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navbar = document.querySelector('.navbar');
        const offset = navbar ? navbar.offsetHeight : 0;
        const targetPosition = element.offsetTop - offset;

        smoothScrollTo(targetPosition, 1000);
    }
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

// Work in Progress Modal with enhanced animation
function showWorkInProgress() {
    const modal = document.getElementById('work-progress-modal');
    if (modal) {
        modal.style.display = 'block';
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.3s ease';
        }, 10);
    }
}

// Funzione per caricare JSZip dinamicamente
async function loadJSZip() {
    if (window.JSZip) return window.JSZip;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => resolve(window.JSZip);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Funzione per scaricare template completo come ZIP reale
async function downloadCompleteTemplate(templateType) {
    const template = templateData[templateType];
    if (!template) return;

    // Mostra animazione di caricamento avanzata
    const loadingElement = createAdvancedLoader();
    document.body.appendChild(loadingElement);

    try {
        // Carica JSZip
        const JSZip = await loadJSZip();
        const zip = new JSZip();

        // Crea struttura cartelle
        const templateFolder = zip.folder(`${templateType}-template-elite`);

        // Aggiungi tutti i file del template
        template.files.forEach(file => {
            templateFolder.file(file.name, file.content);
        });

        // Aggiungi file aggiuntivi
        templateFolder.file('INSTALL.md', createInstallGuide(templateType, template));
        templateFolder.file('LICENSE', createLicense());
        templateFolder.file('.gitignore', createGitIgnore());

        // Genera lo ZIP
        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 9 }
        });

        // Download del file
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateType}-template-elite.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Rimuovi loading e mostra successo
        document.body.removeChild(loadingElement);
        showAdvancedDownloadSuccess(templateType);

    } catch (error) {
        console.error('Errore durante la creazione dello ZIP:', error);
        document.body.removeChild(loadingElement);
        showDownloadError();
    }
}

function createAdvancedLoader() {
    const loader = document.createElement('div');
    loader.className = 'cosmic-loader';
    loader.innerHTML = `
        <div class="cosmic-container">
            <div class="cosmic-orb">
                <div class="orb-core"></div>
                <div class="orb-ring ring-1"></div>
                <div class="orb-ring ring-2"></div>
                <div class="orb-ring ring-3"></div>
            </div>
            <div class="cosmic-text">
                <div class="loading-title">Creazione Template Elite</div>
                <div class="loading-subtitle">Generazione architettura avanzata...</div>
                <div class="loading-progress">
                    <div class="progress-orb"></div>
                </div>
            </div>
            <div class="cosmic-particles"></div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .cosmic-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, #1a0033 0%, #000 70%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            color: white;
            overflow: hidden;
        }

        .cosmic-container {
            text-align: center;
            position: relative;
        }

        .cosmic-orb {
            width: 150px;
            height: 150px;
            position: relative;
            margin: 0 auto 3rem;
        }

        .orb-core {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, #00f0ff 0%, #ff006e 50%, #39ff14 100%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: orbPulse 2s ease-in-out infinite;
            box-shadow: 0 0 30px #00f0ff, 0 0 60px #ff006e;
        }

        .orb-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            border: 2px solid;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.6;
        }

        .ring-1 {
            width: 80px;
            height: 80px;
            border-color: #00f0ff;
            animation: ringRotate 3s linear infinite;
        }

        .ring-2 {
            width: 110px;
            height: 110px;
            border-color: #ff006e;
            animation: ringRotate 4s linear infinite reverse;
        }

        .ring-3 {
            width: 140px;
            height: 140px;
            border-color: #39ff14;
            animation: ringRotate 5s linear infinite;
        }

        .loading-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 900;
            background: linear-gradient(45deg, #00f0ff, #ff006e, #39ff14);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: cosmicShimmer 3s ease-in-out infinite;
            margin-bottom: 1rem;
        }

        .loading-subtitle {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            animation: textFloat 4s ease-in-out infinite;
        }

        .loading-progress {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }

        .progress-orb {
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00f0ff, #ff006e);
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -10px;
            animation: progressFlow 3s ease-in-out infinite;
            box-shadow: 0 0 15px #00f0ff;
        }

        .cosmic-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .cosmic-particles::before,
        .cosmic-particles::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00f0ff;
            border-radius: 50%;
            animation: particleFloat 6s ease-in-out infinite;
        }

        .cosmic-particles::before {
            top: 20%;
            left: 20%;
            animation-delay: 0s;
        }

        .cosmic-particles::after {
            bottom: 20%;
            right: 20%;
            animation-delay: 3s;
        }

        @keyframes orbPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes ringRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes cosmicShimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes textFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes progressFlow {
            0% { left: -10px; }
            100% { left: 290px; }
        }
    `;

    document.head.appendChild(style);
    return loader;
}

function showAdvancedDownloadSuccess(templateType) {
    const successElement = document.createElement('div');
    successElement.className = 'success-cosmic';
    successElement.innerHTML = `
        <div class="success-orb">
            <div class="check-mark">✓</div>
        </div>
        <h3>Template Scaricato!</h3>
        <p>${templateType.toUpperCase()} Template Elite pronto per il decollo</p>
    `;

    successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(57, 255, 20, 0.9));
        color: #000;
        padding: 2rem;
        border-radius: 20px;
        z-index: 10003;
        animation: successSlide 0.5s ease;
        font-weight: 600;
        box-shadow: 0 20px 40px rgba(0, 240, 255, 0.4);
        text-align: center;
        min-width: 300px;
    `;

    document.body.appendChild(successElement);

    setTimeout(() => {
        if (document.body.contains(successElement)) {
            document.body.removeChild(successElement);
        }
    }, 5000);
}

function createInstallGuide(templateType, template) {
    return `# ${template.title}

## 🚀 Installazione Rapida

### Prerequisiti
- Browser moderno (Chrome, Firefox, Safari, Edge)
- Editor di codice (VS Code consigliato)

### Setup Locale
1. Estrai i file dalla cartella ZIP
2. Apri index.html nel browser
3. Modifica i contenuti a tuo piacimento

### Deploy su GitHub Pages
1. Carica i file su GitHub
2. Vai su Settings > Pages
3. Seleziona "Deploy from branch"

### Personalizzazione
- Modifica i colori nelle variabili CSS
- Sostituisci i contenuti di esempio
- Aggiungi le tue immagini

⭐ Se ti piace, lascia una stella su GitHub!
`;
}

function createLicense() {
    return `MIT License

Copyright (c) 2024 Francesco Vampirelli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

function createGitIgnore() {
    return `# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs
*.log

# Dependencies
node_modules/
bower_components/

# Build outputs
dist/
build/
*.min.js
*.min.css

# Environment variables
.env
`;
}

function showDownloadError() {
    console.error('Errore durante il download');
}

const templateData = {
    developer: {
        title: "Developer Elite Template",
        description: "Portfolio ultra-moderno per sviluppatori",
        files: [
            {
                name: "index.html",
                type: "html",
                size: "45.3 KB",
                icon: "fab fa-html5",
                content: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developer Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Portfolio Developer</h1>
    <p>Template moderno per sviluppatori</p>
</body>
</html>`
            },
            {
                name: "style.css",
                type: "css",
                size: "28.2 KB", 
                icon: "fab fa-css3-alt",
                content: `body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; }`
            }
        ]
    },
    creative: {
        title: "Creative Master Template",
        description: "Portfolio artistico completo",
        files: [
            {
                name: "index.html",
                type: "html",
                size: "32.1 KB",
                icon: "fab fa-html5",
                content: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Creative Portfolio</title>
</head>
<body>
    <h1>Portfolio Creativo</h1>
</body>
</html>`
            }
        ]
    },
    business: {
        title: "Business Pro Template",
        description: "Portfolio elegante per manager",
        files: [
            {
                name: "index.html",
                type: "html", 
                size: "25.4 KB",
                icon: "fab fa-html5",
                content: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Business Portfolio</title>
</head>
<body>
    <h1>Portfolio Business</h1>
</body>
</html>`
            }
        ]
    },
    minimal: {
        title: "Minimal Luxury Template",
        description: "Design pulito e minimalista",
        files: [
            {
                name: "index.html",
                type: "html",
                size: "18.7 KB", 
                icon: "fab fa-html5",
                content: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Minimal Portfolio</title>
</head>
<body>
    <h1>Portfolio Minimal</h1>
</body>
</html>`
            }
        ]
    }
};

// Enhanced Template page function
function openTemplate(templateType) {
    const modal = document.getElementById('template-page-modal');
    const content = document.getElementById('template-page-content');
    const template = templateData[templateType];

    if (template && modal && content) {
        let htmlContent = `
            <h2 class="template-title">${template.title}</h2>
            <p class="template-description">${template.description}</p>
            <div class="template-files-grid">
        `;

        template.files.forEach(file => {
            htmlContent += `
                <div class="file-card">
                    <div class="file-icon">
                        <i class="${file.icon}"></i>
                    </div>
                    <h3 class="file-name">${file.name}</h3>
                    <p class="file-size">${file.size}</p>
                    <button class="download-file-btn" onclick="downloadRealFile('${file.name}', '${templateType}', '${file.type}')">
                        <i class="fas fa-download"></i>
                        <span>Scarica File</span>
                    </button>
                </div>
            `;
        });

        htmlContent += '</div>';
        content.innerHTML = htmlContent;
        modal.style.display = 'block';
    }
}

// Real file download function
function downloadRealFile(fileName, templateType, fileType) {
    const template = templateData[templateType];
    const file = template.files.find(f => f.name === fileName);

    if (file && file.content) {
        const blob = new Blob([file.content], { type: getContentType(fileType) });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function getContentType(fileType) {
    const types = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'text/javascript',
        'md': 'text/markdown'
    };
    return types[fileType] || 'text/plain';
}

// Close modals
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.opacity = '1';
            }, 300);
        });
    }
});

// Enhanced Scroll animations
function triggerScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.template-card, .service-card, .guide-card, .social-card, .section-title, .section-subtitle'
    );

    elementsToAnimate.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.95)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('\n%c🚀 Portfolio Elite by Francesco Vampirelli 🚀\n%c✨ Design Moderno e Animazioni Avanzate ✨\n%c💎 Template Premium Scaricabili 💎\n%c🎯 Trasforma la Tua Carriera Oggi! 🎯\n\n%cContatti:\n📧 Email: francesco.vampirelli@email.com\n🐙 GitHub: https://github.com/fravamp134\n📸 Instagram: https://instagram.com/francesco.vampirelli\n🎵 TikTok: https://tiktok.com/@fravamp6\n\n%c⭐ Se ti piace il mio lavoro, lascia una stella! ⭐\n', 
        'color: #00f0ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00f0ff;',
        'color: #ff006e; font-size: 16px; font-weight: bold;',
        'color: #39ff14; font-size: 16px; font-weight: bold;',
        'color: #f59e0b; font-size: 16px; font-weight: bold;',
        'color: #8b5cf6; font-size: 14px;',
        'color: #6366f1; font-size: 12px; font-weight: bold;'
    );
});