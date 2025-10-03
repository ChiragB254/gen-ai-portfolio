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

// GET /api/blog/[slug] - Get a specific blog post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const post = await getBlogPost(resolvedParams.slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    if (!post.published) {
      return NextResponse.json(
        { error: 'Blog post not published' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error in blog post API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}