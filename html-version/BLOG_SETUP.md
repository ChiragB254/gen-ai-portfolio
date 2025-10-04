# Markdown Blog System

Your portfolio now supports writing blog posts in Markdown that automatically convert to beautifully styled HTML pages!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip3 install markdown
```

### 2. Create a Sample Post

```bash
python3 build_blog.py --sample
```

This creates a sample blog post at `_posts/sample-rag-guide.md`

### 3. Build Blog Posts

```bash
python3 build_blog.py
```

This converts all `.md` files in `_posts/` to HTML pages in the `blog/` directory.

### 4. View Your Blog

Open the generated HTML file:
```bash
open blog/getting-started-with-rag-systems.html
```

## 📝 Writing a Blog Post

### Step 1: Create a Markdown File

Create a new `.md` file in the `_posts/` directory (e.g., `my-new-post.md`):

```markdown
---
title: My Awesome Blog Post
date: 2024-10-03
description: This is a short description of my blog post
category: RAG & LLMs
tags: [AI, ML, Python]
pinned: false
---

## Introduction

Your blog post content goes here...

### Subheading

More content with **bold**, *italic*, and `code`.

```python
def hello_world():
    print("Hello, World!")
```

- Bullet points
- Work great
- Too!
```

### Step 2: Frontmatter Fields

The frontmatter (between `---`) contains metadata:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Post title | `My Awesome Post` |
| `date` | ✅ Yes | Publication date | `2024-10-03` |
| `description` | ✅ Yes | Short description | `Learn about...` |
| `category` | ❌ No | Category name | `RAG & LLMs` |
| `tags` | ❌ No | List of tags | `[AI, ML, Python]` |
| `pinned` | ❌ No | Pin to top of blog | `true` or `false` |
| `slug` | ❌ No | Custom URL slug | `my-custom-slug` |

### Step 3: Write Content

After the second `---`, write your content in Markdown. Supported features:

#### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

#### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](image.jpg)
```

#### Code
Inline: `` `code` ``

Block:
```markdown
```python
def example():
    return "code block"
```
```

#### Lists
```markdown
- Bullet item 1
- Bullet item 2

1. Numbered item 1
2. Numbered item 2
```

#### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

#### Blockquotes
```markdown
> This is a blockquote
> Multiple lines work too
```

### Step 4: Build and Publish

```bash
python3 build_blog.py
```

Your new blog post will be generated as an HTML file in the `blog/` directory!

## 🔧 How It Works

### Directory Structure

```
html-version/
├── _posts/                    # Markdown source files
│   ├── my-post.md            # Your markdown posts
│   ├── another-post.md
│   └── posts.json            # Auto-generated metadata
├── blog/                      # Generated HTML files
│   ├── my-post.html          # Built HTML pages
│   └── another-post.html
├── blog-template.html         # HTML template
├── build_blog.py              # Build script
├── index.html                 # Homepage
└── posts.html                 # Blog listing page
```

### Build Process

1. **Read Markdown**: Script reads all `.md` files in `_posts/`
2. **Parse Frontmatter**: Extracts metadata (title, date, tags, etc.)
3. **Convert to HTML**: Converts Markdown content to HTML
4. **Apply Template**: Inserts content into `blog-template.html`
5. **Generate Files**: Creates HTML files in `blog/` directory
6. **Update posts.json**: Updates metadata file for blog listing

### Updating Blog Lists

After building, you need to manually update the blog listings in:
- `index.html` (around line 911) - Homepage latest posts
- `posts.html` (around line 407) - Full blog listing

Copy the content from `_posts/posts.json` into the `allPosts` array in both files.

**Future Enhancement**: Modify these files to fetch data from `posts.json` automatically using JavaScript.

## 📋 Categories

Currently available categories:
- **RAG & LLMs** - Retrieval Augmented Generation and Language Models
- **MLOps & Infrastructure** - ML Operations and Infrastructure
- **AI Research** - AI Research and Papers
- **Tutorials** - How-to guides and tutorials

Feel free to create new categories by using them in your post frontmatter!

## 🎨 Customizing the Template

The blog template is in `blog-template.html`. You can customize:

### Colors
Edit CSS variables at the top:
```css
:root {
    --accent-color: #2563eb;  /* Change to your brand color */
    --bg-color: #ffffff;
    /* ... more variables */
}
```

### Fonts
Change the font import:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Code Highlighting
Change the highlight.js theme:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/YOUR-THEME.min.css">
```

Popular themes: `github-dark`, `monokai`, `atom-one-dark`, `vs2015`

## 🤖 Automation Ideas

### Watch Mode
Create a script that watches for changes and auto-builds:

```bash
# Install watchdog
pip3 install watchdog

# Create watch.py
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

class BlogBuilder(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('.md'):
            subprocess.run(['python3', 'build_blog.py'])

observer = Observer()
observer.schedule(BlogBuilder(), './_posts', recursive=False)
observer.start()
```

### Git Hooks
Auto-build on commit:

```bash
# .git/hooks/pre-commit
#!/bin/sh
python3 build_blog.py
git add blog/
```

### GitHub Actions
Auto-deploy to GitHub Pages:

```yaml
# .github/workflows/build-blog.yml
name: Build Blog
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pip install markdown
      - name: Build blog
        run: python3 build_blog.py
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 📊 Analytics

To track blog post views, add analytics to `blog-template.html`:

### Google Analytics
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

### Simple Analytics
```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

## 🔍 SEO Optimization

The template already includes:
- ✅ Meta description
- ✅ Semantic HTML
- ✅ Proper heading hierarchy
- ✅ Mobile responsive

Add more SEO features:

```html
<!-- Open Graph -->
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{DESCRIPTION}}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://yoursite.com/blog/{{SLUG}}.html">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{TITLE}}">
<meta name="twitter:description" content="{{DESCRIPTION}}">
```

## 🐛 Troubleshooting

### "markdown package not found"
```bash
pip3 install markdown
```

### "No .md files found"
Make sure you have `.md` files in the `_posts/` directory (not just `README.md`).

### Posts not showing on website
After running `build_blog.py`, you need to:
1. Copy the content from `_posts/posts.json`
2. Paste it into the `allPosts` array in both `index.html` and `posts.html`

### Code blocks not highlighting
Make sure your code blocks specify the language:
```markdown
```python
# Your code here
```
```

## 📚 Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Python Markdown Documentation](https://python-markdown.github.io/)
- [Highlight.js Themes](https://highlightjs.org/static/demo/)
- [Font Awesome Icons](https://fontawesome.com/icons)

## 🎉 Example Posts

Check out these example posts in `_posts/`:
- `sample-rag-guide.md` - Comprehensive RAG system guide with code, tables, and formatting examples

## 💡 Tips

1. **Keep it simple**: Start with basic Markdown and add complexity as needed
2. **Use descriptive titles**: Good titles improve SEO and user engagement
3. **Add tags**: Tags help users find related content
4. **Write good descriptions**: The description appears on the blog listing page
5. **Test locally**: Always preview your posts before publishing
6. **Version control**: Commit your markdown files to git
7. **Regular backups**: Back up your `_posts/` directory

## 🚀 Next Steps

1. Write your first real blog post
2. Customize the blog template colors
3. Set up automatic builds with git hooks or GitHub Actions
4. Add analytics to track visitors
5. Share your blog posts on social media!

Happy blogging! 🎉
