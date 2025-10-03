'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Download } from 'lucide-react';
import { containerVariants, cardVariants } from '@/lib/animations';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/chirag-bansal-ai', // Replace with your LinkedIn
    icon: <Linkedin className="w-4 h-4" />,
    color: 'hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-blue-400'
  },
  {
    name: 'GitHub',
    href: 'https://github.com/chiragbansal', // Replace with your GitHub
    icon: <Github className="w-4 h-4" />,
    color: 'hover:bg-slate-600/10 hover:border-slate-500/30 hover:text-slate-300'
  },
  {
    name: 'Kaggle',
    href: 'https://kaggle.com/chiragbansal', // Replace with your Kaggle
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336"/>
      </svg>
    ),
    color: 'hover:bg-cyan-600/10 hover:border-cyan-500/30 hover:text-cyan-400'
  },
  {
    name: 'Resume',
    href: '/resume.pdf', // Replace with your resume file
    icon: <Download className="w-4 h-4" />,
    color: 'hover:bg-ai-primary/10 hover:border-ai-primary/30 hover:text-ai-primary',
    isDownload: true
  }
];

export default function SocialLinks() {
  return (
    <motion.div
      variants={containerVariants}
      className="flex gap-2 justify-center sm:justify-start"
    >
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.href}
          target={link.isDownload ? '_self' : '_blank'}
          rel={link.isDownload ? undefined : 'noopener noreferrer'}
          download={link.isDownload}
          custom={index}
          variants={cardVariants}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          className={`
            group inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap
            bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50
            transition-all duration-300 cursor-pointer text-xs
            ${link.color}
          `}
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            {link.icon}
          </div>
          <span className="font-medium text-xs whitespace-nowrap">
            {link.name}
          </span>
          
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.a>
      ))}
    </motion.div>
  );
}