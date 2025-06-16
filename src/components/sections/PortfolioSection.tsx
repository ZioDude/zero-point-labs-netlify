"use client";

import Link from "next/link";
import { motion, Variants, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  ArrowRight, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Smartphone
} from "lucide-react";
import React, { useRef, useState } from "react";

// Custom styles for mobile scroll
const customStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .phone-iframe {
    border-radius: 2.5rem;
    overflow: hidden;
  }
  .phone-iframe::-webkit-scrollbar {
    display: none;
  }
  .phone-iframe iframe {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .phone-iframe iframe::-webkit-scrollbar {
    display: none;
  }
`;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Portfolio projects data
const portfolioProjects = [
  {
    id: 1,
    title: "GP Realty Finance",
    description: "Commercial real estate financing platform with comprehensive loan solutions and client portal.",
    category: "Next.js Development",
    websiteUrl: "https://gprealty.vercel.app/",
    color: "#2563eb",
    accent: "#1d4ed8"
  },
  {
    id: 2,
    title: "Shilla Lace",
    description: "Premium Shopify e-commerce store selling luxury lingerie worldwide with elegant design and seamless shopping experience.",
    category: "Shopify Store",
    websiteUrl: "https://shillalace.com/",
    color: "#ec4899",
    accent: "#db2777"
  },
  {
    id: 3,
    title: "Cyprus Tourism Portal",
    description: "Multilingual tourism website with booking system and destination galleries.",
    category: "Wix Website", 
    websiteUrl: "https://cyprus-tourism-demo.com/",
    color: "#0ea5e9",
    accent: "#0284c7"
  },
  {
    id: 4,
    title: "Marketing Automation Hub",
    description: "Workflow automation platform connecting CRM, email marketing, and project management.",
    category: "Workflow Automation",
    websiteUrl: "https://autoflow-demo.com/",
    color: "#22c55e",
    accent: "#16a34a"
  }
];

// Enhanced Phone Mockup Component
const PhoneMockup = ({ project }: { project: typeof portfolioProjects[0] }) => {
  return (
    <div className="relative mx-auto" style={{ width: '360px', height: '720px' }}>
      {/* Outer Shadow */}
      <div className="absolute inset-0 rounded-[3rem] bg-black/30 blur-2xl transform translate-y-8 scale-105 opacity-60"></div>
      
      {/* Phone Frame */}
      <div className="relative w-full h-full bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 rounded-[3rem] p-2 shadow-2xl shadow-black/80 border border-gray-700/50">
        {/* Inner Frame */}
        <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2.8rem] p-1 shadow-inner">
          {/* Screen Container - Clean and Minimal */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden shadow-inner border border-gray-800/50">
            {/* Website Content - Full Screen */}
            <div className="w-full h-full relative">
              <iframe
                src={project.websiteUrl}
                className="w-full h-full border-0 phone-iframe"
                style={{
                  borderRadius: '2.5rem'
                }}
                title={`${project.title} Preview`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Hide iframe and show screenshot fallback
                  const iframe = e.currentTarget;
                  const container = iframe.parentElement;
                  iframe.style.display = 'none';
                  
                  // Create screenshot image as fallback
                  const img = document.createElement('img');
                  img.src = `https://api.screenshotone.com/take?access_key=_demo_&url=${encodeURIComponent(project.websiteUrl)}&viewport_width=375&viewport_height=812&device_scale_factor=2&format=webp&response_type=image`;
                  img.className = 'w-full h-full object-cover';
                  img.style.borderRadius = '2.5rem';
                  img.alt = `${project.title} Screenshot`;
                  
                  // Add click handler to open actual site
                  img.style.cursor = 'pointer';
                  img.onclick = () => window.open(project.websiteUrl, '_blank');
                  
                  if (container) {
                    container.appendChild(img);
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Side Buttons */}
        {/* Power Button */}
        <div className="absolute right-[-2px] top-28 w-1 h-14 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l shadow-inner border-t border-b border-gray-500/30"></div>
        
        {/* Volume Up */}
        <div className="absolute left-[-2px] top-24 w-1 h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r shadow-inner border-t border-b border-gray-500/30"></div>
        
        {/* Volume Down */}
        <div className="absolute left-[-2px] top-38 w-1 h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r shadow-inner border-t border-b border-gray-500/30"></div>
        
        {/* Silent Switch */}
        <div className="absolute left-[-1px] top-20 w-0.5 h-4 bg-gray-700 rounded-r"></div>
      </div>
      
      {/* Floating Glow Effect */}
      <div 
        className="absolute inset-0 rounded-[3rem] blur-xl opacity-20 -z-10 animate-pulse"
        style={{ 
          background: `radial-gradient(circle at center, ${project.color}40, transparent 70%)`,
          transform: 'scale(1.1)',
          animationDuration: '3s'
        }}
      ></div>
      
      {/* Additional Accent Glow */}
      <div 
        className="absolute inset-0 rounded-[3rem] blur-2xl opacity-10 -z-20"
        style={{ 
          background: `linear-gradient(135deg, ${project.color}30, ${project.accent}20, transparent)`,
          transform: 'scale(1.2)'
        }}
      ></div>
    </div>
  );
};

// Project Selection Card
const ProjectCard = ({ 
  project, 
  isActive, 
  onClick 
}: { 
  project: typeof portfolioProjects[0]; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full p-6 text-left rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 shadow-lg shadow-orange-500/10' 
          : 'bg-neutral-900/50 border-neutral-700/50 hover:border-neutral-600/50 hover:bg-neutral-800/50'
      }`}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
      )}
      
      {/* Category Badge */}
      <Badge 
        className={`mb-3 text-xs font-medium ${
          isActive 
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
            : 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50'
        }`}
      >
        {project.category}
      </Badge>
      
      {/* Project Info */}
      <h3 className="text-lg font-semibold text-slate-100 mb-2 leading-tight">
        {project.title}
      </h3>
      
      <p className="text-sm text-slate-400 leading-relaxed">
        {project.description}
      </p>
      
      {/* Color Accent */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl"
        style={{ backgroundColor: isActive ? '#f97316' : project.color }}
      ></div>
    </motion.button>
  );
};

export default function PortfolioSection() {
  const [currentProject, setCurrentProject] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % portfolioProjects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + portfolioProjects.length) % portfolioProjects.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 md:px-8 bg-[#0A0A0A] text-slate-100 overflow-hidden"
    >
      {/* Custom Styles */}
      <style jsx>{customStyles}</style>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-10" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 md:mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Eye className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            </div>
            <Badge className="border-orange-500/50 text-orange-400 bg-orange-950/50 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium">
              Portfolio
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-slate-100 mb-4 md:mb-6"
          >
            See Our Work <span className="text-orange-500">Live</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-300/80 max-w-3xl mx-auto leading-relaxed"
          >
            Experience real websites in action. Select a project below to explore the live site.
          </motion.p>
        </motion.div>

        {/* Mobile-First Layout */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start"
        >
          {/* Phone Preview - Shows First on Mobile */}
          <motion.div 
            variants={itemVariants} 
            className="order-1 lg:order-2 flex flex-col items-center space-y-6 lg:space-y-8"
          >
            {/* Preview Header */}
            <div className="text-center space-y-2 lg:space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Smartphone className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-base lg:text-lg font-medium">Live Preview</span>
              </div>
              <h4 className="text-lg lg:text-xl font-semibold text-slate-200">
                {portfolioProjects[currentProject].title}
              </h4>
            </div>

            {/* Phone Mockup with Animation */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="scale-75 md:scale-90 lg:scale-100"
                >
                  <PhoneMockup project={portfolioProjects[currentProject]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Website Link */}
            <Link href={portfolioProjects[currentProject].websiteUrl} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-600 text-neutral-300 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5 px-4 py-2 lg:px-6 lg:py-3"
              >
                <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                View Full Site
              </Button>
            </Link>
          </motion.div>

          {/* Project Selection - Compact on Mobile */}
          <motion.div 
            variants={itemVariants} 
            className="order-2 lg:order-1 space-y-6 lg:space-y-8"
          >
            {/* Compact Header with Navigation */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">
                Choose Project
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevProject}
                  className="w-8 h-8 lg:w-10 lg:h-10 p-0 border-neutral-600 text-neutral-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
                >
                  <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
                <span className="text-xs lg:text-sm text-slate-400 px-2 lg:px-3">
                  {currentProject + 1} / {portfolioProjects.length}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextProject}
                  className="w-8 h-8 lg:w-10 lg:h-10 p-0 border-neutral-600 text-neutral-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
                >
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </div>

            {/* Horizontal Scroll on Mobile, Vertical on Desktop */}
            <div className="block lg:hidden">
              {/* Mobile: Horizontal Scroll Cards */}
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {portfolioProjects.map((project, index) => (
                  <motion.button
                    key={project.id}
                    onClick={() => setCurrentProject(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex-shrink-0 w-64 p-4 text-left rounded-xl border transition-all duration-300 snap-start ${
                      index === currentProject 
                        ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 shadow-lg shadow-orange-500/10' 
                        : 'bg-neutral-900/50 border-neutral-700/50 hover:border-neutral-600/50'
                    }`}
                  >
                    {/* Active Indicator */}
                    {index === currentProject && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                    )}
                    
                    {/* Category Badge */}
                    <Badge 
                      className={`mb-2 text-xs font-medium ${
                        index === currentProject 
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
                          : 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50'
                      }`}
                    >
                      {project.category}
                    </Badge>
                    
                    {/* Project Info */}
                    <h4 className="font-semibold text-slate-100 text-sm mb-2 leading-tight">
                      {project.title}
                    </h4>
                    
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Color Accent */}
                    <div 
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-b-xl"
                      style={{ backgroundColor: index === currentProject ? '#f97316' : project.color }}
                    ></div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Desktop: Vertical Stack */}
            <div className="hidden lg:block space-y-4">
              {portfolioProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={index === currentProject}
                  onClick={() => setCurrentProject(index)}
                />
              ))}
            </div>

            {/* Action Button */}
            <Link href="/start-project">
              <Button
                size="lg"
                className="w-full group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold py-3 lg:py-4 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 