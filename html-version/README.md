# Chirag Bansal - Portfolio (HTML/CSS/JS Version)

A modern, responsive portfolio website built with pure **HTML**, **CSS**, and **JavaScript** showcasing ML Engineering expertise in Generative AI, LLMs, and RAG architectures.

## 🎉 **Converted from Next.js**

This is a **pure HTML/CSS/JS version** of the Next.js portfolio, providing:
- ✅ **No build process** - Just open `index.html` in a browser
- ✅ **No dependencies** - Everything is vanilla code (except Lucide icons CDN)
- ✅ **Easy deployment** - Upload to any static hosting service
- ✅ **Fast loading** - Optimized CSS and JavaScript
- ✅ **All features preserved** - Navigation, animations, and interactivity

## 🚀 **Quick Start**

### **Option 1: Open Locally**
1. Open `index.html` in your web browser
2. That's it! The portfolio is fully functional

### **Option 2: Run with Local Server (Recommended)**
For the best experience, use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 📁 **Project Structure**

```
html-version/
├── index.html          # Main HTML file with all sections
├── css/
│   └── styles.css      # All styles with CSS variables
├── js/
│   └── script.js       # All JavaScript functionality
├── images/             # Your images go here
└── README.md          # This file
```

## 🎨 **Features**

### **✨ Modern Design**
- Gradient color schemes (Purple/Blue theme)
- Smooth animations and transitions
- Card-based layouts with hover effects
- Responsive design for all devices

### **🔧 Fully Functional**
- **Navigation**: Smooth scrolling, active section highlighting
- **Mobile Menu**: Responsive hamburger menu
- **Projects Section**: Dynamic project cards with metrics
- **Status Section**: Animated counters and real-time stats
- **Environment Section**: System metrics with progress bars
- **Blog Section**: Ready for blog posts (currently empty state)
- **Contact Section**: Direct links to email, phone, and location

### **🎭 Animations**
- Fade-in animations on scroll
- Counter animations for metrics
- Progress bar animations
- Smooth hover effects
- Mobile menu slide animations

## ⚙️ **Customization Guide**

### **1. Update Personal Information**

**In `index.html`:**
```html
<!-- Update hero section -->
<h1 class="hero-title">
    Hi, I'm <span class="text-gradient">Your Name</span>
</h1>

<!-- Update contact info -->
<a href="mailto:your-email@domain.com" class="contact-card">
    <div class="contact-icon">📧</div>
    <h3>Email</h3>
    <p>your-email@domain.com</p>
</a>
```

### **2. Add/Edit Projects**

**In `js/script.js`:**
```javascript
const projects = [
    {
        id: '1',
        title: 'Your Project Title',
        description: 'Your project description...',
        technologies: ['Tech1', 'Tech2', 'Tech3'],
        metrics: [
            { label: 'Accuracy', value: '95%' },
            { label: 'Performance', value: '2x faster' }
        ],
        featured: true,  // Makes it span full width
        github: 'https://github.com/username/repo',
        demo: 'https://demo-link.com',
    },
    // Add more projects...
];
```

### **3. Customize Colors**

**In `css/styles.css`:**
```css
:root {
    /* Change primary and accent colors */
    --color-primary: #6366f1;    /* Purple/Indigo */
    --color-accent: #06b6d4;     /* Cyan/Blue */
    
    /* Or try other themes */
    /* Red theme */
    --color-primary: #ef4444;
    --color-accent: #f59e0b;
    
    /* Green theme */
    --color-primary: #10b981;
    --color-accent: #3b82f6;
}
```

### **4. Update Social Links**

**In `index.html`:**
```html
<div class="social-links">
    <a href="https://linkedin.com/in/your-profile" target="_blank" class="social-link">
        <i data-lucide="linkedin"></i>
        <span>LinkedIn</span>
    </a>
    <a href="https://github.com/your-username" target="_blank" class="social-link">
        <i data-lucide="github"></i>
        <span>GitHub</span>
    </a>
    <!-- Add more links -->
</div>
```

### **5. Add Blog Posts**

**In `js/script.js`:**
```javascript
// Replace the renderBlog function with actual blog posts
const blogPosts = [
    {
        id: '1',
        title: 'Your Blog Post Title',
        excerpt: 'Short description of your blog post...',
        category: 'AI/ML',
        date: 'Jan 15, 2024',
        link: '#'
    },
    // Add more posts...
];

function renderBlog() {
    const blogGrid = document.getElementById('blogGrid');
    const blogEmptyState = document.getElementById('blogEmptyState');
    
    if (blogPosts.length > 0) {
        blogGrid.style.display = 'grid';
        blogEmptyState.style.display = 'none';
        
        blogPosts.forEach(post => {
            // Create blog card HTML
        });
    }
}
```

## 🌐 **Deployment Options**

### **1. GitHub Pages**
```bash
# Create a new repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/portfolio.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Set source to main branch / root folder
```

Access at: `https://username.github.io/portfolio`

### **2. Netlify**
1. Drag and drop the `html-version` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site is live instantly!
3. Optional: Connect to GitHub for automatic deployments

### **3. Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd html-version
vercel
```

### **4. Traditional Web Hosting**
Upload the `html-version` folder contents via FTP to your web host:
- **cPanel**: Use File Manager or FTP
- **Shared Hosting**: Upload to `public_html` or `www` folder
- **VPS**: Use SCP or SFTP to transfer files

### **5. Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 🎯 **Browser Support**

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 **Responsive Breakpoints**

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 **Technical Details**

### **Dependencies**
- **Lucide Icons** (CDN) - For icons
- No other external dependencies!

### **Performance**
- **Vanilla JavaScript** - No framework overhead
- **CSS Variables** - Dynamic theming
- **Optimized Animations** - Uses CSS transforms and transitions
- **Lazy Loading** - IntersectionObserver for scroll animations

### **Features Implemented**
- ✅ Smooth scrolling navigation
- ✅ Active section highlighting
- ✅ Mobile-responsive menu
- ✅ Animated counters
- ✅ Progress bars with animations
- ✅ Scroll-triggered animations
- ✅ Dynamic content rendering
- ✅ Custom scrollbar styling
- ✅ Touch-friendly interactions

## 🐛 **Troubleshooting**

### **Icons not showing**
- Check internet connection (icons load from CDN)
- Verify Lucide CDN is accessible
- Call `lucide.createIcons()` after dynamic content loads

### **Styles not applying**
- Verify `css/styles.css` path is correct
- Check browser console for errors
- Clear browser cache

### **Animations not working**
- Check if browser supports Intersection Observer
- Verify JavaScript is enabled
- Check console for errors

### **Mobile menu not opening**
- Verify JavaScript is loaded
- Check for console errors
- Ensure `lucide.createIcons()` is called

## 📝 **To-Do / Future Enhancements**

- [ ] Add actual blog post functionality
- [ ] Integrate with a headless CMS
- [ ] Add contact form with backend
- [ ] Implement dark mode toggle
- [ ] Add PWA features (service worker, manifest)
- [ ] Add Google Analytics
- [ ] Add schema.org markup for SEO
- [ ] Create PDF resume generator
- [ ] Add particle.js or similar effects

## 💡 **Tips**

1. **Images**: Add your images to the `images/` folder and reference them:
   ```html
   <img src="images/your-photo.jpg" alt="Your Name">
   ```

2. **Fonts**: The portfolio uses Inter from Google Fonts. To change:
   ```html
   <!-- In index.html, replace the font link -->
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **Analytics**: Add Google Analytics by including this before `</head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 📞 **Support**

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Verify all file paths are correct
3. Ensure you're running from a local server (not `file://`)

## 📄 **License**

This portfolio template is free to use for personal and commercial projects.

---

**Built with ❤️ using pure HTML, CSS, and JavaScript**

*Converted from Next.js to provide a lightweight, dependency-free portfolio solution.*

## 🎉 **You're Ready!**

Your portfolio is now ready to deploy. Just:
1. Update your personal information
2. Add your projects and content
3. Customize colors to your liking
4. Deploy to your favorite hosting service

**Good luck with your portfolio!** 🚀
