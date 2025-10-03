'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { getBlogPost, getLatestBlogPosts, type BlogPost } from '@/lib/blog';
import { fadeInVariants, containerVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = React.use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const blogPost = await getBlogPost(resolvedParams.slug);
        if (!blogPost) {
          notFound();
          return;
        }
        setPost(blogPost);
        
        // Load related posts
        const latest = await getLatestBlogPosts(3);
        const related = latest.filter(p => p.slug !== resolvedParams.slug).slice(0, 2);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Error loading blog post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-20 mb-8"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-700 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimatedReadTime = (content?: string) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={fadeInVariants} className="mb-8">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-ai-primary hover:text-ai-cyan transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Blog</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header variants={fadeInVariants} className="mb-12">
            {/* Category Badge */}
            {post.category && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ai-primary/20 text-ai-primary border border-ai-primary/30 mb-6">
                {post.category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              {post.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime ? `${post.readTime} min read` : estimatedReadTime(post.content)}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Article Content */}
          <motion.article 
            variants={fadeInVariants}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8">
              {post.content ? (
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Content Coming Soon</h3>
                  <p className="text-slate-400">
                    This blog post is currently being written. Check back soon for the full content!
                  </p>
                </div>
              )}
            </div>
          </motion.article>

          {/* Navigation to other posts */}
          <motion.div 
            variants={fadeInVariants}
            className="mt-16 pt-8 border-t border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6">More Posts</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-ai-primary/30 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <h4 className="font-semibold text-white group-hover:text-ai-cyan transition-colors duration-300 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}