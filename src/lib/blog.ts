// Client-side blog utility that fetches from API routes

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

// API response interfaces
interface BlogAPIResponse {
  posts: BlogPostCard[];
  categories: string[];
  total: number;
}

interface BlogPostAPIResponse {
  post: BlogPost;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogPostAPIResponse = await response.json();
    return data.post;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogAPIResponse = await response.json();
    
    // Convert BlogPostCard[] to BlogPost[] (without content)
    return data.posts.map(post => ({
      ...post,
      content: '' // Content is not included in list responses for performance
    }));
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    return [];
  }
}

export async function getBlogPostCards(): Promise<BlogPostCard[]> {
  try {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogAPIResponse = await response.json();
    return data.posts;
  } catch (error) {
    console.error('Error getting blog post cards:', error);
    return [];
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPostCard[]> {
  try {
    const response = await fetch(`/api/blog?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogAPIResponse = await response.json();
    return data.posts;
  } catch (error) {
    console.error('Error getting latest blog posts:', error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogAPIResponse = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error getting blog categories:', error);
    return ['All'];
  }
}

// Utility function to estimate reading time
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Generate blog post statistics
export async function getBlogStats() {
  try {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogAPIResponse = await response.json();
    const posts = data.posts;
    const categories = data.categories.filter(cat => cat !== 'All');
    
    return {
      totalPosts: posts.length,
      categories: categories.length,
      tags: [...new Set(posts.flatMap(post => post.tags))].length,
      averageReadTime: posts.reduce((sum, post) => sum + (post.readTime || 0), 0) / posts.length || 0,
      latestPost: posts[0]?.date || null,
      pinnedPosts: posts.filter(post => post.pinned).length
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    return {
      totalPosts: 0,
      categories: 0,
      tags: 0,
      averageReadTime: 0,
      latestPost: null,
      pinnedPosts: 0
    };
  }
}
