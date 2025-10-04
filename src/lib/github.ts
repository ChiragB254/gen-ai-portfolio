interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string;
  company: string;
  bio: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
}

interface GitHubEventPayload {
  commits?: { length: number }[];
  ref_type?: string;
  action?: string;
}

interface GitHubEvent {
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload: GitHubEventPayload;
}

export interface GitHubStats {
  totalCommits: number;
  publicRepos: number;
  totalStars: number;
  recentActivity: {
    type: string;
    repo: string;
    date: string;
    description: string;
  }[];
  topLanguages: {
    name: string;
    percentage: number;
  }[];
  contributionsThisYear: number;
}

// Replace with your GitHub username
const GITHUB_USERNAME = 'chiragbansal';
const GITHUB_API_BASE = 'https://api.github.com';

// Optional: Add your GitHub token for higher rate limits
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  'Accept': 'application/vnd.github.v3+json',
  // Uncomment if you have a token:
  // 'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
};

export async function fetchGitHubUser(): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, { 
    headers,
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`, { 
    headers,
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=30`, { 
    headers,
    next: { revalidate: 1800 } // Cache for 30 minutes
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const [user, repos, events] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepos(),
      fetchGitHubEvents()
    ]);

    // Calculate total stars
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Get recent activity
    const recentActivity = events
      .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type))
      .slice(0, 3)
      .map(event => {
        let description = '';
        switch (event.type) {
          case 'PushEvent':
            const commits = event.payload.commits?.length || 1;
            description = `Pushed ${commits} commit${commits > 1 ? 's' : ''} to`;
            break;
          case 'CreateEvent':
            description = event.payload.ref_type === 'repository' ? 'Created repository' : 'Created branch in';
            break;
          case 'PullRequestEvent':
            description = event.payload.action === 'opened' ? 'Opened PR in' : 'Updated PR in';
            break;
          default:
            description = 'Activity in';
        }
        
        return {
          type: event.type,
          repo: event.repo.name.split('/')[1], // Get repo name only
          date: event.created_at,
          description
        };
      });

    // Calculate language distribution
    const languageCount: { [key: string]: number } = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    const totalRepos = Object.values(languageCount).reduce((sum, count) => sum + count, 0);
    const topLanguages = Object.entries(languageCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalRepos) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Estimate total commits (this is approximate since GitHub API doesn't provide total commits directly)
    const pushEvents = events.filter(event => event.type === 'PushEvent');
    const recentCommits = pushEvents.reduce((sum, event) => sum + (event.payload.commits?.length || 0), 0);
    const estimatedTotalCommits = Math.max(recentCommits * 10, 100); // Rough estimate

    // Estimate contributions this year
    const thisYear = new Date().getFullYear();
    const thisYearEvents = events.filter(event => 
      new Date(event.created_at).getFullYear() === thisYear
    );
    const contributionsThisYear = thisYearEvents.length * 2; // Rough estimate

    return {
      totalCommits: estimatedTotalCommits,
      publicRepos: user.public_repos,
      totalStars,
      recentActivity,
      topLanguages,
      contributionsThisYear
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Return fallback data
    return {
      totalCommits: 1200,
      publicRepos: 25,
      totalStars: 150,
      recentActivity: [
        {
          type: 'PushEvent',
          repo: 'portfolio-nextjs',
          date: new Date().toISOString(),
          description: 'Pushed 3 commits to'
        }
      ],
      topLanguages: [
        { name: 'TypeScript', percentage: 35 },
        { name: 'Python', percentage: 30 },
        { name: 'JavaScript', percentage: 20 },
        { name: 'CSS', percentage: 15 }
      ],
      contributionsThisYear: 250
    };
  }
}

// Helper function to format time ago
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}