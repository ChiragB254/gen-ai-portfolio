// Legacy BlogPost interface for compatibility
export interface LegacyBlogPost {
  id: string
  title: string
  excerpt: string
  category: 'generative-ai' | 'machine-learning' | 'production' | 'tutorials'
  date: string
  readTime: string
  tags: string[]
  icon?: string
  featured?: boolean
  href?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  metrics?: {
    label: string
    value: string
  }[]
  featured?: boolean
  href?: string
  github?: string
  demo?: string
  image?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | 'Present'
  achievements: string[]
  technologies: string[]
  current?: boolean
}

export interface Skill {
  name: string
  category: 'generative-ai' | 'machine-learning' | 'production' | 'data' | 'cloud'
  level?: number
}

export interface SkillCategory {
  title: string
  icon: string
  skills: string[]
}

export interface SectionProps {
  className?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  tags: string[];
  author?: string;
  pinned: boolean;
  published: boolean;
  slug: string;
  content?: string;
  readTime?: number;
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
