'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { SectionProps } from '@/types';
import { getBlogPostCards, getBlogCategories, type BlogPostCard } from '@/lib/blog';
import { containerVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import BlogCard from './BlogCard';

interface BlogSectionProps extends SectionProps {}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

export default function BlogSection({ className }: BlogSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [blogCards, setBlogCards] = useState<BlogPostCard[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  // Load blog posts and categories on component mount
  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [posts, cats] = await Promise.all([
          getBlogPostCards(),
          getBlogCategories()
        ]);
        setBlogCards(posts);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading blog data:', error);
        setBlogCards([]);
        setCategories(['All']);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogCards.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    // Separate pinned and regular posts
    const pinnedPosts = filtered.filter(post => post.pinned);
    const regularPosts = filtered.filter(post => !post.pinned);

    return [...pinnedPosts, ...regularPosts];
  }, [blogCards, searchTerm, selectedCategory, sortOption]);

  const getSortIcon = () => {
    return sortOption.includes('desc') ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />;
  };

  return (
    <section className={cn("py-20 relative", className)}>
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
              className="text-lg text-slate-300 max-w-2xl mx-auto"
              variants={containerVariants}
            >
              Thoughts on AI, machine learning, web development, and the intersection of technology and creativity.
            </motion.p>
          </div>

          {/* Controls */}
          <div className="mb-12 space-y-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-ai-cyan/50 focus:ring-2 focus:ring-ai-cyan/20 transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-ai-cyan/50 focus:ring-2 focus:ring-ai-cyan/20 transition-all duration-300"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
                {getSortIcon()}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-300 flex items-center mr-2">
                <Filter className="w-4 h-4 mr-1" />
                Categories:
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
                    selectedCategory === category
                      ? "bg-ai-primary text-white border border-ai-primary"
                      : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-ai-primary/30 hover:text-ai-primary"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-8">
            <p className="text-sm text-slate-400">
              {filteredAndSortedPosts.length === 0 ? (
                "No posts found matching your criteria."
              ) : (
                `Showing ${filteredAndSortedPosts.length} post${filteredAndSortedPosts.length === 1 ? '' : 's'}`
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
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
          {!loading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedPosts.map((post, index) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAndSortedPosts.length === 0 && (
            <motion.div
              variants={containerVariants}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-slate-400 mb-6">
                {blogCards.length === 0 
                  ? "No blog posts have been created yet."
                  : "Try adjusting your search terms or category filter."
                }
              </p>
              {blogCards.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortOption('date-desc');
                  }}
                  className="px-4 py-2 bg-ai-primary text-white rounded-lg hover:bg-ai-primary/80 transition-colors duration-300"
                >
                  Reset Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}