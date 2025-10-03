'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { MapPin, Clock, GitCommit, Folder, Code, Activity, Star } from 'lucide-react';
import { SectionProps } from '@/types';
import { containerVariants, cardVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { getGitHubStats, getTimeAgo } from '@/lib/github';

interface CurrentStatusProps extends SectionProps {
  id?: string;
}

interface StatusMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
}

export default function CurrentStatus({ className, id }: CurrentStatusProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [githubStats, setGithubStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      controls.start('visible');
    }
  }, [inView, controls]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getGitHubStats();
        setGithubStats(stats);
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Use GitHub data when available, fallback to placeholder values
  const statusMetrics: StatusMetric[] = [
    {
      id: 'commits',
      label: 'Total Commits',
      value: githubStats?.totalCommits || 1400,
      suffix: '',
      icon: <GitCommit className="w-6 h-6" />,
      color: 'text-green-400'
    },
    {
      id: 'repos',
      label: 'Public Repos',
      value: githubStats?.publicRepos || 31,
      suffix: '',
      icon: <Folder className="w-6 h-6" />,
      color: 'text-blue-400'
    },
    {
      id: 'hours',
      label: 'Hours Coding',
      value: Math.floor((githubStats?.contributionsThisYear || 250) * 4.2), // Rough estimate: contributions * avg hours per contribution
      suffix: 'h',
      icon: <Code className="w-6 h-6" />,
      color: 'text-purple-400'
    },
    {
      id: 'projects',
      label: 'Projects Live',
      value: Math.floor((githubStats?.publicRepos || 31) * 0.48), // ~48% of repos are live projects
      suffix: '',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-ai-cyan'
    }
  ];

  // Animated counter hook
  const useAnimatedCounter = (target: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setCount(Math.floor(progress * target));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [target, duration, isVisible]);

    return count;
  };

  const StatusCard = ({ metric, index }: { metric: StatusMetric; index: number }) => {
    const animatedValue = useAnimatedCounter(metric.value);

    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
        whileHover="hover"
        className="group relative bg-slate-700/30 rounded-xl border border-slate-600/50 p-4 hover:border-ai-primary/30 transition-all duration-300"
      >
        {/* Icon and Value Row */}
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300",
            "bg-slate-600/50 group-hover:bg-ai-primary/20",
            metric.color
          )}>
            {React.cloneElement(metric.icon as React.ReactElement, { className: "w-4 h-4" })}
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold text-white tabular-nums">
              {animatedValue.toLocaleString()}
              <span className="text-sm text-slate-400 ml-1">{metric.suffix}</span>
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="text-slate-300 text-sm font-medium pl-11">{metric.label}</p>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-ai-primary/5 to-ai-cyan/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>
    );
  };

  return (
    <section ref={ref} id={id} className={cn("py-12 relative", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
        >
          {/* Section Header */}
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              variants={containerVariants}
            >
              Current Status
            </motion.h2>
            <motion.p 
              className="text-slate-300 max-w-lg mx-auto"
              variants={containerVariants}
            >
              Real-time metrics from my development journey
            </motion.p>
          </div>

          {/* Status Info */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm"
            variants={containerVariants}
          >
            {/* Location */}
            <div className="flex items-center gap-2 text-slate-300 bg-slate-700/30 px-3 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-ai-primary" />
              <span>San Francisco, CA</span>
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-2 bg-green-400/10 px-3 py-2 rounded-full border border-green-400/20">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-green-400 font-medium">Available</span>
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-2 text-slate-400 bg-slate-700/30 px-3 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span>Updated 2h ago</span>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statusMetrics.map((metric, index) => (
              <StatusCard key={metric.id} metric={metric} index={index} />
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            variants={cardVariants}
            className="bg-slate-700/30 rounded-xl border border-slate-600/50 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-ai-primary" />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm animate-pulse">
                    <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0"></div>
                    <div className="h-4 bg-slate-600/50 rounded flex-1"></div>
                    <div className="h-4 w-20 bg-slate-600/50 rounded"></div>
                    <div className="h-4 w-8 bg-slate-600/50 rounded"></div>
                  </div>
                ))
              ) : (
                githubStats?.recentActivity?.map((activity: any, index: number) => {
                  const colors = ['bg-ai-cyan', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'];
                  const textColors = ['text-ai-cyan', 'text-green-400', 'text-purple-400', 'text-yellow-400'];
                  const colorIndex = index % colors.length;
                  
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 ${colors[colorIndex]} rounded-full flex-shrink-0`}></div>
                      <span className="text-slate-300 flex-1">{activity.description}</span>
                      <code className={`px-2 py-1 bg-slate-600/50 rounded ${textColors[colorIndex]} text-xs`}>
                        {activity.repo}
                      </code>
                      <span className="text-slate-400 text-xs ml-2">
                        {getTimeAgo(activity.date)}
                      </span>
                    </div>
                  );
                }) || [
                  // Fallback data
                  <div key="fallback1" className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-ai-cyan rounded-full flex-shrink-0"></div>
                    <span className="text-slate-300 flex-1">Pushed 3 commits to</span>
                    <code className="px-2 py-1 bg-slate-600/50 rounded text-ai-cyan text-xs">portfolio-nextjs</code>
                    <span className="text-slate-400 text-xs ml-2">2h</span>
                  </div>,
                  <div key="fallback2" className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-300 flex-1">Created repository</span>
                    <code className="px-2 py-1 bg-slate-600/50 rounded text-green-400 text-xs">ml-optimizer</code>
                    <span className="text-slate-400 text-xs ml-2">1d</span>
                  </div>
                ]
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}