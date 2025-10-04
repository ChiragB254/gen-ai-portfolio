import Navigation from '@/components/ui/Navigation'
import Projects from '@/components/sections/Projects'
import CurrentStatus from '@/components/CurrentStatus'
import DevEnvironment from '@/components/DevEnvironment'
import BlogPreview from '@/components/BlogPreview'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center py-20 relative overflow-hidden">
          <div className="absolute inset-0 ai-pattern-bg opacity-5" />
          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium border border-primary-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available for opportunities</span>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                    Hi, I&apos;m <span className="text-gradient">Chirag Bansal</span>
                  </h1>
                  <h2 className="text-xl lg:text-2xl text-gray-400 mb-6">
                    ML Engineer specializing in <span className="text-accent-400">Generative AI</span> & <span className="text-accent-400">LLMs</span>
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    2+ years of production experience delivering measurable impact through AI solutions. 
                    Expert in RAG architectures, model deployment, and turning complex business problems into data-driven solutions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-8">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary-500">78%</div>
                    <div className="text-sm text-gray-500">Model Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary-500">$100K+</div>
                    <div className="text-sm text-gray-500">Cost Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary-500">38%</div>
                    <div className="text-sm text-gray-500">Response Time Improvement</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#projects" className="btn btn-primary">
                    View Projects
                  </a>
                  <a href="#contact" className="btn btn-secondary">
                    Get In Touch
                  </a>
                </div>
                <SocialLinks />
              </div>
              <div className="relative">
                <div className="w-80 h-80 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                    <div className="text-6xl">🤖</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Projects />
        
        {/* Current Status Section */}
        <CurrentStatus id="status" className="bg-slate-900/50" />
        
        {/* Development Environment Section */}
        <DevEnvironment id="environment" className="bg-slate-800/30" />
        
        {/* Blog Preview Section */}
        <BlogPreview id="blog" className="bg-slate-900/50" />

        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-32">
          <div className="container-custom">
            <div className="text-center mb-16">
              <span className="section-badge mb-4">Contact</span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Let&apos;s Build Something Amazing</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                Ready to collaborate on AI projects? I&apos;m always interested in discussing new opportunities and innovative solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <a href="mailto:chiragbansal254@gmail.com" className="card p-6 text-center hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  📧
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-400 text-sm">chiragbansal254@gmail.com</p>
              </a>
              <a href="tel:+14374313144" className="card p-6 text-center hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  📱
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-400 text-sm">(+1) 437-431-3144</p>
              </a>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  📍
                </div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-400 text-sm">Scarborough, ON, Canada</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-dark-900 py-8 border-t border-primary-500/10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Chirag Bansal. Powered by AI Innovation.
            </p>
            <div className="flex gap-6">
              <a href="#home" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Home</a>
              <a href="#projects" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Projects</a>
              <a href="#status" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Status</a>
              <a href="#environment" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Environment</a>
              <a href="#blog" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Blog</a>
              <a href="#contact" className="text-gray-400 hover:text-ai-primary transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}