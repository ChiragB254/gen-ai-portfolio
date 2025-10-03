interface SystemStats {
  gpu: {
    usage: number;
    temperature: number;
    memory: number;
    model: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    downloadSpeed: number;
    uploadSpeed: number;
  };
}

// Simulate system stats (since we can't access real system info from browser)
export function getSystemStats(): SystemStats {
  // Generate realistic-looking random values
  const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
  
  return {
    gpu: {
      usage: Math.round(randomBetween(60, 85)),
      temperature: Math.round(randomBetween(65, 78)),
      memory: Math.round(randomBetween(8, 14)),
      model: 'RTX 4090'
    },
    memory: {
      used: Math.round(randomBetween(24, 38)),
      total: 64,
      percentage: Math.round(randomBetween(37, 60))
    },
    cpu: {
      usage: Math.round(randomBetween(25, 65)),
      cores: 16,
      model: 'AMD Ryzen 9 7950X'
    },
    storage: {
      used: Math.round(randomBetween(1200, 1800) / 1000 * 100) / 100,
      total: 4,
      percentage: Math.round(randomBetween(30, 45))
    },
    network: {
      downloadSpeed: Math.round(randomBetween(850, 950)),
      uploadSpeed: Math.round(randomBetween(450, 550))
    }
  };
}

// For development stats
export interface DevStats {
  commitsToday: number;
  activeBranches: number;
  buildSuccessRate: number;
  linesOfCodeThisWeek: number;
  issuesResolved: number;
  pullRequestsMerged: number;
}

export function getDevStats(): DevStats {
  const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    commitsToday: randomBetween(8, 15),
    activeBranches: randomBetween(4, 8),
    buildSuccessRate: randomBetween(92, 98),
    linesOfCodeThisWeek: randomBetween(1200, 2500),
    issuesResolved: randomBetween(3, 8),
    pullRequestsMerged: randomBetween(2, 6)
  };
}

// Training/Project stats
export interface TrainingStats {
  currentProject: string;
  progress: number;
  eta: string;
  status: 'training' | 'completed' | 'failed' | 'paused';
  startTime: string;
  model: string;
  dataset: string;
}

export function getCurrentTraining(): TrainingStats {
  const projects = [
    'Custom Triton Kernel Optimization',
    'LLM Fine-tuning Pipeline',
    'RAG System Enhancement',
    'Computer Vision Model Training',
    'NLP Sentiment Analysis'
  ];
  
  const models = [
    'Llama 3.1 7B',
    'GPT-4o Mini',
    'Claude 3 Haiku',
    'BERT Large',
    'ResNet-50'
  ];
  
  const datasets = [
    'Custom Dataset',
    'OpenWebText',
    'Common Crawl',
    'ImageNet',
    'GLUE Benchmark'
  ];
  
  return {
    currentProject: projects[Math.floor(Math.random() * projects.length)],
    progress: Math.floor(Math.random() * 30) + 70, // Between 70-100%
    eta: `${Math.floor(Math.random() * 45) + 15} minutes`,
    status: Math.random() > 0.2 ? 'training' : 'completed',
    startTime: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(), // Random time within last 4 hours
    model: models[Math.floor(Math.random() * models.length)],
    dataset: datasets[Math.floor(Math.random() * datasets.length)]
  };
}

// Battery info (for laptops)
export interface BatteryInfo {
  level: number;
  charging: boolean;
  timeRemaining: string;
}

export async function getBatteryInfo(): Promise<BatteryInfo | null> {
  try {
    // Check if Battery API is available
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        timeRemaining: battery.dischargingTime === Infinity 
          ? 'Unknown' 
          : `${Math.round(battery.dischargingTime / 3600)}h ${Math.round((battery.dischargingTime % 3600) / 60)}m`
      };
    }
    return null;
  } catch (error) {
    console.warn('Battery API not available:', error);
    return null;
  }
}

// Get connection info
export interface ConnectionInfo {
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

export function getConnectionInfo(): ConnectionInfo | null {
  try {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        type: conn.type || 'unknown',
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0
      };
    }
    return null;
  } catch (error) {
    console.warn('Connection API not available:', error);
    return null;
  }
}

// Memory info (Chrome only)
export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export function getMemoryInfo(): MemoryInfo | null {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  } catch (error) {
    console.warn('Memory API not available:', error);
    return null;
  }
}