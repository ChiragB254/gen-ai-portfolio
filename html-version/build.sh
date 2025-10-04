#!/bin/bash

# Blog Build Script
# Convenient script to build your markdown blog posts

set -e

echo "🚀 Building Blog Posts..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    exit 1
fi

# Check if markdown package is installed
if ! python3 -c "import markdown" 2>/dev/null; then
    echo "📦 Installing markdown package..."
    pip3 install markdown
    echo ""
fi

# Build blog posts
python3 build_blog.py

echo ""
echo "✨ Build complete!"
echo ""
echo "📂 Generated files are in the 'blog/' directory"
echo "📝 Post metadata updated in '_posts/posts.json'"
echo ""
echo "Next steps:"
echo "  1. Preview your posts: open blog/*.html"
echo "  2. Update index.html and posts.html with new post data"
echo "  3. Commit and push your changes"
echo ""
