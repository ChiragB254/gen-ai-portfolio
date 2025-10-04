#!/usr/bin/env python3
"""
Blog Builder Script
Converts Markdown (.md) files to HTML blog posts using a template.
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

try:
    import markdown
    from markdown.extensions import fenced_code, tables, codehilite
except ImportError:
    print("Error: 'markdown' package not found.")
    print("Install it with: pip install markdown")
    exit(1)

# Directories
POSTS_DIR = Path("_posts")
BLOG_DIR = Path("blog")
TEMPLATE_FILE = Path("blog-template.html")
POSTS_JSON = POSTS_DIR / "posts.json"

def parse_frontmatter(content):
    """Parse YAML-like frontmatter from markdown file."""
    frontmatter = {}
    
    # Check if file starts with ---
    if not content.startswith('---'):
        return frontmatter, content
    
    # Find the ending ---
    try:
        end = content.index('---', 3)
        frontmatter_text = content[3:end].strip()
        content = content[end + 3:].strip()
        
        # Parse frontmatter
        for line in frontmatter_text.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                # Handle lists (tags)
                if value.startswith('[') and value.endswith(']'):
                    # Parse list
                    value = [item.strip().strip('"').strip("'") for item in value[1:-1].split(',')]
                
                # Remove quotes
                elif value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                
                frontmatter[key] = value
        
    except ValueError:
        # No ending --- found
        pass
    
    return frontmatter, content

def create_slug(title):
    """Create URL-friendly slug from title."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def format_date(date_str):
    """Format date string to readable format."""
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%B %d, %Y')
    except:
        return date_str

def convert_markdown_to_html(md_file):
    """Convert a single markdown file to HTML."""
    
    # Read markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse frontmatter
    frontmatter, md_content = parse_frontmatter(content)
    
    # Required fields
    if 'title' not in frontmatter:
        print(f"Warning: {md_file} missing 'title' in frontmatter. Skipping.")
        return None
    
    # Set defaults
    title = frontmatter.get('title', 'Untitled')
    date = frontmatter.get('date', datetime.now().strftime('%Y-%m-%d'))
    date_formatted = format_date(date)
    description = frontmatter.get('description', '')
    category = frontmatter.get('category', 'Uncategorized')
    tags = frontmatter.get('tags', [])
    pinned = frontmatter.get('pinned', 'false').lower() == 'true'
    
    # Create slug
    slug = frontmatter.get('slug', create_slug(title))
    
    # Convert markdown to HTML
    md = markdown.Markdown(extensions=[
        'fenced_code',
        'tables',
        'codehilite',
        'nl2br',
        'sane_lists'
    ])
    html_content = md.convert(md_content)
    
    # Read template
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Create tags HTML
    tags_html = ''.join([f'<span class="tag">{tag}</span>' for tag in tags])
    
    # Replace placeholders
    html = template.replace('{{TITLE}}', title)
    html = html.replace('{{DATE}}', date_formatted)
    html = html.replace('{{DESCRIPTION}}', description)
    html = html.replace('{{CATEGORY}}', category)
    html = html.replace('{{TAGS}}', tags_html)
    html = html.replace('{{CONTENT}}', html_content)
    
    # Create output filename
    output_file = BLOG_DIR / f"{slug}.html"
    
    # Write HTML file
    BLOG_DIR.mkdir(exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✓ Generated: {output_file}")
    
    # Return post metadata for posts.json
    return {
        'title': title,
        'date': date,
        'dateFormatted': date_formatted,
        'url': f'blog/{slug}.html',
        'description': description,
        'category': category,
        'tags': tags,
        'pinned': pinned
    }

def build_all_posts():
    """Build all markdown posts in _posts directory."""
    
    if not POSTS_DIR.exists():
        print(f"Error: {POSTS_DIR} directory not found.")
        return
    
    if not TEMPLATE_FILE.exists():
        print(f"Error: {TEMPLATE_FILE} not found.")
        return
    
    # Find all .md files
    md_files = list(POSTS_DIR.glob('*.md'))
    
    if not md_files:
        print(f"No .md files found in {POSTS_DIR}")
        return
    
    print(f"\nBuilding {len(md_files)} blog post(s)...\n")
    
    posts_data = []
    
    for md_file in md_files:
        post_data = convert_markdown_to_html(md_file)
        if post_data:
            posts_data.append(post_data)
    
    # Sort by date (newest first)
    posts_data.sort(key=lambda x: x['date'], reverse=True)
    
    # Save posts.json
    with open(POSTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(posts_data, f, indent=4)
    
    print(f"\n✓ Updated: {POSTS_JSON}")
    print(f"\n✅ Successfully built {len(posts_data)} post(s)!")
    print(f"\nBlog posts are in the '{BLOG_DIR}' directory.")
    print(f"Don't forget to update the allPosts array in index.html and posts.html")

def create_sample_post():
    """Create a sample markdown post for demonstration."""
    sample_md = """---
title: Getting Started with RAG Systems
date: 2024-09-15
description: A comprehensive guide to building Retrieval Augmented Generation systems from scratch
category: RAG & LLMs
tags: [RAG, LLMs, Python, Vector Databases]
pinned: true
---

## Introduction

Retrieval Augmented Generation (RAG) has emerged as one of the most powerful patterns for building LLM applications. In this guide, we'll explore how to build a production-ready RAG system from scratch.

## What is RAG?

RAG combines the power of large language models with external knowledge retrieval. Instead of relying solely on the model's training data, RAG systems:

1. Retrieve relevant information from a knowledge base
2. Augment the prompt with this context
3. Generate responses based on both the retrieved information and the model's knowledge

## Architecture Overview

A typical RAG system consists of several key components:

### 1. Document Processing

```python
def process_documents(documents):
    # Split documents into chunks
    chunks = chunk_documents(documents)
    
    # Generate embeddings
    embeddings = embed_chunks(chunks)
    
    # Store in vector database
    store_embeddings(chunks, embeddings)
```

### 2. Retrieval

When a user asks a question:

```python
def retrieve_context(query, k=5):
    # Embed the query
    query_embedding = embed_text(query)
    
    # Find similar chunks
    results = vector_db.search(query_embedding, k=k)
    
    return results
```

### 3. Generation

```python
def generate_response(query, context):
    prompt = f\"\"\"
    Context: {context}
    
    Question: {query}
    
    Answer:
    \"\"\"
    
    return llm.generate(prompt)
```

## Key Considerations

### Chunking Strategy

The way you chunk your documents significantly impacts retrieval quality:

- **Fixed-size chunks**: Simple but may split semantic units
- **Sentence-based**: Preserves semantic meaning
- **Paragraph-based**: Maintains context but may be too large

### Vector Database Selection

Choose based on your needs:

| Database | Best For | Pros | Cons |
|----------|----------|------|------|
| FAISS | Local development | Fast, free | No persistence |
| Qdrant | Production | Feature-rich | Requires setup |
| Pinecone | Cloud-first | Managed service | Costs $ |

### Embedding Models

Popular choices:

- **OpenAI Ada-002**: High quality, but costs add up
- **Sentence Transformers**: Free, open-source
- **Custom models**: Fine-tuned for your domain

## Production Tips

> Always implement proper error handling and fallbacks in production RAG systems.

Here are some best practices:

1. **Implement caching** to reduce API costs
2. **Monitor retrieval quality** with evaluation metrics
3. **Use hybrid search** (keyword + semantic)
4. **Implement re-ranking** for better results

## Conclusion

Building a RAG system requires careful consideration of many factors. Start simple, measure performance, and iterate based on your specific use case.

### Next Steps

- Experiment with different chunking strategies
- Try various embedding models
- Implement evaluation metrics
- Add caching and monitoring

---

*Have questions about RAG systems? Feel free to reach out!*
"""
    
    sample_file = POSTS_DIR / "sample-rag-guide.md"
    
    if not sample_file.exists():
        POSTS_DIR.mkdir(exist_ok=True)
        with open(sample_file, 'w', encoding='utf-8') as f:
            f.write(sample_md)
        print(f"✓ Created sample post: {sample_file}")
        return True
    return False

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--sample':
        print("Creating sample markdown post...\n")
        if create_sample_post():
            print("\nSample post created! Now run: python build_blog.py")
        else:
            print("Sample post already exists.")
    else:
        build_all_posts()
