'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import BlogSection from '@/components/BlogSection';
import { containerVariants, fadeInVariants } from '@/lib/animations';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={fadeInVariants} className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-ai-primary hover:text-ai-cyan transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Page Header */}
          <motion.header variants={fadeInVariants} className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ai-primary/20 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 text-ai-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Thoughts on AI, machine learning, web development, and the intersection of technology and creativity.
            </p>
          </motion.header>
        </motion.div>
      </div>

      {/* Blog Section */}
      <BlogSection className="pt-0" />
    </div>
  );
}