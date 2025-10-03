import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogDirectory = path.join(process.cwd(), 'blog');

export interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
  category?: string;
  tags: string[];
  author?: string;
  pinned: boolean;
  published: boolean;
  readTime?: number;
}

export interface BlogPost extends BlogPostMetadata {
  id: string;
  slug: string;
  content: string;
}

export interface BlogPostCard {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  tags: string[];
  pinned: boolean;
  slug: string;
  readTime?: number;
}

function getAllBlogSlugs(): string[] {
  try {
    if (!fs.existsSync(blogDirectory)) {
      console.warn('Blog directory not found:', blogDirectory);
      return [];
    }

    const filenames = fs.readdirSync(blogDirectory);
    return filenames
      .filter(name => name.endsWith('.md'))
      .map(name => name.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Process markdown content
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    
    const contentHtml = processedContent.toString();

    return {
      id: slug,
      slug,
      content: contentHtml,
      ...matterResult.data as BlogPostMetadata,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const slugs = getAllBlogSlugs();
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getBlogPost(slug);
        return post;
      })
    );

    return posts
      .filter((post): post is BlogPost => post !== null)
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    return [];
  }
}

function getBlogCategories(): string[] {
  try {
    const slugs = getAllBlogSlugs();
    const categories = new Set<string>();
    
    slugs.forEach(slug => {
      try {
        const fullPath = path.join(blogDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        if (matterResult.data.published && matterResult.data.category) {
          categories.add(matterResult.data.category);
        }
      } catch (error) {
        console.warn(`Error reading metadata for ${slug}:`, error);
      }
    });

    return ['All', ...Array.from(categories).sort()];
  } catch (error) {
    console.error('Error getting blog categories:', error);
    return ['All'];
  }
}

// GET /api/blog - Get all blog posts with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    
    let posts = await getAllBlogPosts();
    
    // Filter by category if specified
    if (category && category !== 'All') {
      posts = posts.filter(post => post.category === category);
    }
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum)) {
        // Separate pinned and regular posts
        const pinnedPosts = posts.filter(post => post.pinned);
        const regularPosts = posts.filter(post => !post.pinned);
        
        // Combine with pinned posts first, then apply limit
        const combinedPosts = [...pinnedPosts, ...regularPosts];
        posts = combinedPosts.slice(0, limitNum);
      }
    }
    
    // Convert to card format for list responses
    const blogCards: BlogPostCard[] = posts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date,
      description: post.description,
      category: post.category,
      tags: post.tags,
      pinned: post.pinned,
      slug: post.slug,
      readTime: post.readTime
    }));

    return NextResponse.json({
      posts: blogCards,
      categories: getBlogCategories(),
      total: posts.length
    });
  } catch (error) {
    console.error('Error in blog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}