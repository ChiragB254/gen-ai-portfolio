'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn, scrollToSection } from '@/lib/utils'

const navigationItems = [
  { name: 'Home', href: 'home', isAnchor: true },
  { name: 'Projects', href: 'projects', isAnchor: true },
  { name: 'Status', href: 'status', isAnchor: true },
  { name: 'Environment', href: 'environment', isAnchor: true },
  { name: 'Blog', href: '/blog', isAnchor: false },
  { name: 'Contact', href: 'contact', isAnchor: true },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Only update active section on the home page
      if (pathname === '/') {
        const anchorSections = navigationItems.filter(item => item.isAnchor).map(item => item.href)
        const currentSection = anchorSections.find(section => {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            return rect.top <= 100 && rect.bottom >= 100
          }
          return false
        })

        if (currentSection) {
          setActiveSection(currentSection)
        }
      } else if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        setActiveSection('/blog')
      }
    }

    // Set initial active section based on pathname
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
      setActiveSection('/blog')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const handleNavClick = (item: typeof navigationItems[0]) => {
    setIsMobileMenuOpen(false)
    
    if (item.isAnchor) {
      if (pathname !== '/') {
        // If we're not on the home page, navigate to home first
        router.push(`/#${item.href}`)
      } else {
        // If we're on the home page, scroll to section
        scrollToSection(item.href)
      }
    } else {
      // Handle page routes
      router.push(item.href)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-ai-primary/10'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick({ name: 'Home', href: 'home', isAnchor: true })}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-ai-primary to-ai-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => handleNavClick(item)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group',
                  activeSection === item.href
                    ? 'text-ai-primary'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {item.name}
                {activeSection === item.href && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-ai-primary rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-ai-primary/10"
          >
            <div className="container-custom py-4">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'block w-full text-left px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg',
                    activeSection === item.href
                      ? 'text-ai-primary bg-ai-primary/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
