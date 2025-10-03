'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Pin, ArrowRight, Clock } from 'lucide-react';
import { BlogPostCard } from '@/types';
import { cardVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostCard;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <motion.article
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={cn(
          "group relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50",
          "hover:border-ai-cyan/30 hover:shadow-lg hover:shadow-ai-cyan/10",
          "transition-all duration-300 p-6 cursor-pointer",
          post.pinned && "ring-2 ring-ai-accent/30"
        )}
      >
      {/* Pinned indicator */}
      {post.pinned && (
        <div className="absolute top-4 right-4">
          <Pin className="w-4 h-4 text-ai-accent fill-current" />
        </div>
      )}

      {/* Category badge */}
      {post.category && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ai-primary/20 text-ai-primary border border-ai-primary/30 mb-4">
          {post.category}
        </div>
      )}

      {/* Title and description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-ai-cyan transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date, Reading Time and Read More */}
      <div className="flex items-center justify-between text-slate-400 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
          {post.readTime && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-ai-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium">Read more</span>
          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ai-cyan/5 to-ai-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.article>
    </Link>
  );
}