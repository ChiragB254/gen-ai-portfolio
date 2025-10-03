'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SectionProps } from '@/types';
import { getLatestBlogPosts, type BlogPostCard } from '@/lib/blog';
import { containerVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import BlogCard from './BlogCard';

interface BlogPreviewProps extends SectionProps {
  id?: string;
}

export default function BlogPreview({ className, id }: BlogPreviewProps) {
  const [latestPosts, setLatestPosts] = useState<BlogPostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestPosts = async () => {
      try {
        const posts = await getLatestBlogPosts(3);
        setLatestPosts(posts);
      } catch (error) {
        console.error('Error loading latest blog posts:', error);
        setLatestPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadLatestPosts();
  }, []);

  return (
    <section id={id} className={cn("py-20 relative", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              variants={containerVariants}
            >
              Latest Blog Posts
            </motion.h2>
            <motion.p 
              className="text-lg text-slate-300 max-w-2xl mx-auto mb-8"
              variants={containerVariants}
            >
              Recent thoughts on AI, machine learning, and web development.
            </motion.p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-slate-800/50 rounded-lg p-6 h-64">
                    <div className="h-4 bg-slate-700 rounded mb-4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded mb-4"></div>
                    <div className="h-2 bg-slate-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && latestPosts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {latestPosts.map((post, index) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  index={index}
                />
              ))}
            </div>
          )}
          {!loading && latestPosts.length > 0 && (
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-ai-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ai-primary/80 transition-all duration-300 group"
              >
                <BookOpen className="w-5 h-5" />
                <span>View All Posts</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Empty State */}
          {!loading && latestPosts.length === 0 && (
            <motion.div
              variants={containerVariants}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-slate-400 mb-6">
                Blog posts are coming soon. Check back later for insights and updates!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}