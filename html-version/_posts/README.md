# Blog Posts

This directory contains the blog post data for the portfolio website.

## How to Add New Blog Posts

To add a new blog post, you need to update the post data in two places:

### 1. Update posts.json

Add your new post to the `posts.json` file in this directory. Each post should have the following structure:

```json
{
    "title": "Your Post Title",
    "date": "YYYY-MM-DD",
    "dateFormatted": "Month DD, YYYY",
    "url": "#",
    "description": "Brief description of your post (160 characters max recommended)",
    "category": "Category Name",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "pinned": false
}
```

### 2. Update JavaScript in HTML Files

You'll also need to update the `allPosts` array in:
- `index.html` (around line 911) - for the homepage latest posts
- `posts.html` (around line 407) - for the full blog listing page

### Post Properties

- **title**: The title of your blog post
- **date**: Publication date in YYYY-MM-DD format (used for sorting)
- **dateFormatted**: Human-readable date format for display
- **url**: Link to the full post (use "#" as placeholder for now)
- **description**: Short excerpt/description of the post
- **category**: Category for filtering (e.g., "RAG & LLMs", "MLOps & Infrastructure")
- **tags**: Array of tags for the post
- **pinned**: Set to `true` to pin the post at the top of the posts page (max 3 pinned posts)

## Categories

Current categories include:
- RAG & LLMs
- MLOps & Infrastructure

Feel free to add new categories as needed.

## Future Enhancements

Consider these improvements for a production blog:

1. **Separate Blog Post Files**: Create individual markdown or HTML files for each post
2. **Dynamic Loading**: Fetch posts from the JSON file using JavaScript fetch API
3. **Static Site Generator**: Use Jekyll, Hugo, or similar to generate blog pages
4. **CMS Integration**: Connect to a headless CMS like Contentful or Strapi
5. **Search Functionality**: Add search capability across blog posts
6. **RSS Feed**: Generate an RSS feed for subscribers
7. **Comments**: Integrate a commenting system like Disqus or Utterances

## Sample Posts

The current posts are samples demonstrating the blog functionality. Replace them with your actual blog posts when ready.
