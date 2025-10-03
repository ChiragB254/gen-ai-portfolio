'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, TrendingUp } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/utils'
import { Project } from '@/types'

const projects: Project[] = [
  {
    id: '1',
    title: 'Financial Document Intelligence System',
    description: 'Production-ready RAG system for analyzing Scotiabank earnings reports with natural language queries. Achieved 92% retrieval accuracy and sub-second response times.',
    technologies: ['RAG', 'Groq API', 'Qdrant', 'Docling', 'T5'],
    metrics: [
      { label: 'Retrieval Accuracy', value: '92%' },
      { label: 'Response Time', value: '<1s' }
    ],
    featured: true,
    href: '#',
  },
  {
    id: '2',
    title: 'Health Buddy - Medical AI Assistant',
    description: 'Fine-tuned Gemma 2 2B model using LoRA for medical query responses. Deployed on Hugging Face Spaces with 1000+ production queries handled.',
    technologies: ['Gemma 2', 'LoRA', 'Hugging Face', 'Gradio'],
    metrics: [
      { label: 'Accuracy', value: '78%' },
      { label: 'Queries Handled', value: '1000+' }
    ],
    github: '#',
    demo: '#',
  },
  {
    id: '3',
    title: 'MLOps Pipeline for Production ML',
    description: 'Comprehensive MLOps pipeline covering the entire ML lifecycle, including model versioning, A/B testing, monitoring strategies, and automated retraining.',
    technologies: ['MLOps', 'Docker', 'A/B Testing', 'Monitoring'],
    github: '#',
  },
  {
    id: '4',
    title: 'Conversational AI with LangChain',
    description: 'Intelligent chatbot using LangChain architecture with prompt engineering, memory management, and integration with vector databases.',
    technologies: ['LangChain', 'OpenAI', 'FAISS', 'Streamlit'],
    github: '#',
    demo: '#',
  },
  {
    id: '5',
    title: 'Anomaly Detection for Fraud Prevention',
    description: 'Real-time fraud detection system using unsupervised learning techniques, featuring case studies from banking industry.',
    technologies: ['Anomaly Detection', 'Python', 'Real-time ML', 'Banking'],
    github: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container-custom">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={staggerItem}
            className="section-badge mb-4"
          >
            Projects
          </motion.span>
          <motion.h2
            variants={staggerItem}
            className="text-3xl lg:text-4xl font-bold mb-6"
          >
            Featured AI Projects
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Showcasing production-ready AI solutions that deliver measurable business impact
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={staggerItem}
              className={`
                group card p-8 h-full flex flex-col
                ${project.featured ? 'lg:col-span-2' : ''}
                hover:-translate-y-2 transition-all duration-300
              `}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {project.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              {project.metrics && (
                <div className="flex gap-6 mb-6">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-5 h-5" />
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent-500/10 text-accent-400 text-sm rounded-full border border-accent-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 mt-auto">
                {project.github && (
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>Code</span>
                  </motion.a>
                )}
                {project.demo && (
                  <motion.a
                    href={project.demo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Demo</span>
                  </motion.a>
                )}
                {project.href && !project.demo && !project.github && (
                  <motion.a
                    href={project.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Learn More</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Interested in collaborating on AI projects or learning more about my work?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Let's Collaborate
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}