'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Monitor, 
  MemoryStick, 
  GitBranch, 
  Zap, 
  Cpu, 
  HardDrive,
  Activity,
  TrendingUp
} from 'lucide-react';
import { SectionProps } from '@/types';
import { containerVariants, cardVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { getSystemStats, getDevStats, getCurrentTraining } from '@/lib/system';
import { getGitHubStats, getTimeAgo } from '@/lib/github';

interface DevEnvironmentProps extends SectionProps {
  id?: string;
}

interface SystemWidget {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: number;
  maxValue: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface ProgressBarProps {
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'critical';
  animated?: boolean;
}

const ProgressBar = ({ value, maxValue, status, animated = true }: ProgressBarProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'critical': return 'bg-red-400';
      default: return 'bg-ai-primary';
    }
  };

  return (
    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
      <motion.div
        className={cn("h-full rounded-full", getStatusColor())}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ 
          duration: animated ? 1.5 : 0,
          ease: "easeOut",
          delay: animated ? 0.3 : 0
        }}
      />
    </div>
  );
};

export default function DevEnvironment({ className, id }: DevEnvironmentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [devStats, setDevStats] = useState<any>(null);
  const [trainingStats, setTrainingStats] = useState<any>(null);
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
    async function fetchAllData() {
      try {
        const [system, dev, training, github] = await Promise.all([
          Promise.resolve(getSystemStats()),
          Promise.resolve(getDevStats()),
          Promise.resolve(getCurrentTraining()),
          getGitHubStats()
        ]);
        
        setSystemStats(system);
        setDevStats(dev);
        setTrainingStats(training);
        setGithubStats(github);
      } catch (error) {
        console.error('Failed to fetch environment data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAllData();
    
    // Update system stats every 30 seconds
    const interval = setInterval(() => {
      setSystemStats(getSystemStats());
      setDevStats(getDevStats());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const systemWidgets: SystemWidget[] = [
    {
      id: 'gpu',
      title: 'GPU Status',
      icon: <Monitor className="w-6 h-6" />,
      value: systemStats?.gpu?.usage || 63,
      maxValue: 100,
      unit: '°C',
      status: (systemStats?.gpu?.usage || 63) > 80 ? 'warning' : 'good',
      description: systemStats?.gpu?.model || 'RTX 4090'
    },
    {
      id: 'memory',
      title: 'Memory',
      icon: <MemoryStick className="w-6 h-6" />,
      value: systemStats?.memory?.used || 26.7,
      maxValue: systemStats?.memory?.total || 64,
      unit: 'GB',
      status: (systemStats?.memory?.percentage || 42) > 80 ? 'critical' : (systemStats?.memory?.percentage || 42) > 60 ? 'warning' : 'good',
      description: 'System RAM'
    },
    {
      id: 'activity',
      title: 'Activity',
      icon: <GitBranch className="w-6 h-6" />,
      value: devStats?.commitsToday || 2,
      maxValue: 20,
      unit: 'commits',
      status: 'good',
      description: 'Last 24h'
    },
    {
      id: 'training',
      title: 'Training',
      icon: <Activity className="w-6 h-6" />,
      value: trainingStats?.progress || 100,
      maxValue: 100,
      unit: '%',
      status: trainingStats?.status === 'training' ? 'good' : 'good',
      description: 'Current Project'
    }
  ];

  const developmentStats = [
    {
      id: 'commits-today',
      label: 'Commits Today',
      value: devStats?.commitsToday || 2,
      icon: <GitBranch className="w-5 h-5 text-ai-primary" />,
      trend: `${devStats?.commitsToday > 10 ? '+' : ''}${Math.floor((devStats?.commitsToday || 2) * 0.3)} from yesterday`
    },
    {
      id: 'active-branches',
      label: 'Active Branches',
      value: devStats?.activeBranches || 7,
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      trend: `${Math.floor((devStats?.activeBranches || 7) * 0.4)} ready for merge`
    },
    {
      id: 'build-status',
      label: 'Build Success Rate',
      value: devStats?.buildSuccessRate || 100,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      trend: `${devStats?.buildSuccessRate || 100}% this week`
    }
  ];

  const SystemWidgetCard = ({ widget, index }: { widget: SystemWidget; index: number }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const timer = setTimeout(() => {
        let start = 0;
        const increment = widget.value / 60;
        const counter = setInterval(() => {
          start += increment;
          if (start >= widget.value) {
            setAnimatedValue(widget.value);
            clearInterval(counter);
          } else {
            setAnimatedValue(start);
          }
        }, 16);

        return () => clearInterval(counter);
      }, index * 200);

      return () => clearTimeout(timer);
    }, [widget.value, index, isVisible]);

    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
        whileHover="hover"
        className="group relative bg-slate-700/30 rounded-xl border border-slate-600/50 p-4 hover:border-ai-primary/30 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-ai-primary">
              {React.cloneElement(widget.icon as React.ReactElement, { className: "w-4 h-4" })}
            </div>
            <h3 className="text-sm font-semibold text-white">{widget.title}</h3>
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            widget.status === 'good' && 'bg-green-400',
            widget.status === 'warning' && 'bg-yellow-400',
            widget.status === 'critical' && 'bg-red-400'
          )} />
        </div>

        {/* Value */}
        <div className="mb-3">
          <span className="text-xl font-bold text-white tabular-nums">
            {animatedValue.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 ml-1">
            {widget.unit}
          </span>
          <span className="text-xs text-slate-500 block">
            of {widget.maxValue}{widget.unit}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <ProgressBar 
            value={animatedValue} 
            maxValue={widget.maxValue} 
            status={widget.status}
            animated={isVisible}
          />
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs">{widget.description}</p>

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
              Development Environment
            </motion.h2>
            <motion.p 
              className="text-slate-300 max-w-lg mx-auto"
              variants={containerVariants}
            >
              Real-time system metrics and development statistics
            </motion.p>
          </div>

          {/* System Widgets Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {systemWidgets.map((widget, index) => (
              <SystemWidgetCard key={widget.id} widget={widget} index={index} />
            ))}
          </div>

          {/* Development Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-700/30 rounded-xl border border-slate-600/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-ai-primary" />
                <h3 className="text-lg font-semibold text-white">Development Activity</h3>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-5 h-5 bg-slate-600/50 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-6 bg-slate-600/50 rounded w-12"></div>
                        <div className="h-4 bg-slate-600/50 rounded w-20"></div>
                        <div className="h-3 bg-slate-600/50 rounded w-16"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  developmentStats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      custom={index}
                      variants={cardVariants}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0">
                        {stat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-bold text-white">
                          {typeof stat.value === 'number' ? stat.value : stat.value}
                          {stat.id === 'build-status' && '%'}
                        </div>
                        <div className="text-sm text-slate-300 truncate">
                          {stat.label}
                        </div>
                        <div className="text-xs text-slate-400">
                          {stat.trend}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* AI Training Progress */}
            <motion.div
              variants={cardVariants}
              className="bg-slate-700/30 rounded-xl border border-slate-600/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-ai-accent" />
                <h3 className="text-lg font-semibold text-white">Training Job</h3>
                {!isLoading && (
                  <div className={cn(
                    "ml-auto px-2 py-1 rounded-full text-xs font-medium",
                    trainingStats?.status === 'training' 
                      ? "bg-ai-accent/20 text-ai-accent" 
                      : "bg-green-400/20 text-green-400"
                  )}>
                    {trainingStats?.status === 'training' ? 'Active' : 'Completed'}
                  </div>
                )}
              </div>
              
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-600/50 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-600/50 rounded w-1/2"></div>
                  </div>
                  <div className="h-2 bg-slate-600/50 rounded w-full"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-600/50 rounded w-20"></div>
                    <div className="h-3 bg-slate-600/50 rounded w-16"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm">
                    <span className="text-slate-300 font-medium block">
                      {trainingStats?.currentProject || 'Custom Triton Kernel Optimization'}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {trainingStats?.model || 'Llama 3.1 7B'} • {trainingStats?.dataset || 'Custom Dataset'}
                    </span>
                  </div>
                  
                  <ProgressBar 
                    value={trainingStats?.progress || 100} 
                    maxValue={100} 
                    status={trainingStats?.status === 'training' ? 'good' : 'good'}
                  />
                  
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>
                      Started: {trainingStats?.startTime ? getTimeAgo(trainingStats.startTime) : '2h ago'}
                    </span>
                    <span>
                      {trainingStats?.status === 'training' 
                        ? `ETA: ${trainingStats?.eta || '23 min'}` 
                        : 'Completed'
                      }
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}