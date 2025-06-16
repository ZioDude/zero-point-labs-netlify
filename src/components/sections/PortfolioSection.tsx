"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  Monitor,
  ArrowUpRight,
  Users,
  Zap,
  Target,
  Building2,
  Brain,
  TrendingUp,
  X,
  Maximize2
} from "lucide-react";

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const projects = [
  {
    id: 1,
    name: "G.P Realty",
    category: "Real Estate Platform",
    shortDescription: "Modern student housing platform",
    detailedDescription: "A comprehensive real estate platform designed specifically for university students seeking rental properties near their campuses. Features advanced search filters, virtual property tours, secure booking system, and seamless communication between students and property owners.",
    url: "https://gprealty.vercel.app/",
    image: "/gprealty.png",
    technologies: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    features: ["Property Search", "Virtual Tours", "Secure Booking", "Student Verification"],
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    accentColor: "blue",
    stats: {
      label: "Active Listings",
      value: "500+"
    }
  },
  {
    id: 2,
    name: "Adverlead",
    category: "Marketing Automation",
    shortDescription: "AI-powered lead generation platform",
    detailedDescription: "An all-in-one marketing and lead generation platform featuring Lee, an AI assistant specifically crafted for renovation professionals. Automates Facebook ads, qualifies leads, books appointments, and manages entire marketing campaigns with intelligent automation.",
    url: "https://lee-ruby.vercel.app/",
    image: "/adverlead.png",
    technologies: ["React", "AI Integration", "Facebook API", "Automation"],
    features: ["AI Assistant", "Ad Automation", "Lead Qualification", "Campaign Management"],
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    accentColor: "purple",
    stats: {
      label: "Leads Generated",
      value: "10k+"
    }
  },
  {
    id: 3,
    name: "Lead Gen Magic",
    category: "Marketing Agency",
    shortDescription: "Professional lead generation services",
    detailedDescription: "A full-service lead generation agency website showcasing magical marketing solutions for businesses. Features comprehensive service offerings, transparent pricing, client testimonials, and conversion-optimized landing pages designed to turn prospects into loyal customers.",
    url: "https://gitmcp.vercel.app/",
    image: "/leadgenmagic.png",
    technologies: ["Next.js", "Framer Motion", "CRO", "Analytics"],
    features: ["Service Showcase", "Pricing Plans", "Lead Capture", "Analytics Dashboard"],
    icon: Target,
    color: "from-orange-500 to-red-500",
    accentColor: "orange",
    stats: {
      label: "Conversion Rate",
      value: "15%+"
    }
  }
];

const ProjectModal = ({ project, isOpen, onClose }: { 
  project: typeof projects[0] | null, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  if (!project) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 bg-neutral-800/50 border-b border-neutral-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${project.color} bg-opacity-10`}>
                  <project.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <p className="text-sm text-slate-400">{project.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
                  onClick={() => window.open(project.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 p-0 hover:bg-red-500/20 hover:text-red-400"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Website iframe */}
            <div className="relative flex-1 h-full bg-white">
              <iframe
                src={project.url}
                className="w-full h-full border-0"
                title={`${project.name} Live Preview`}
                style={{ height: 'calc(90vh - 80px)' }}
              />
            </div>

            {/* Mobile Close Button */}
            <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Button
                size="lg"
                className="bg-black/80 text-white border border-white/20 backdrop-blur-md hover:bg-black/60 shadow-xl"
                onClick={onClose}
              >
                <X className="w-5 h-5 mr-2" />
                Close Preview
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, index, onOpenModal }: { 
  project: typeof projects[0], 
  index: number,
  onOpenModal: (project: typeof projects[0]) => void 
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group"
    >
      <Card className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 border-neutral-700/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-neutral-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2">
        {/* Project Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={project.image}
              alt={`${project.name} Screenshot`}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="lg"
                className="bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                onClick={() => onOpenModal(project)}
              >
                <Maximize2 className="w-5 h-5 mr-2" />
                Preview Site
              </Button>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${
              project.accentColor === 'blue' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              project.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
              'bg-orange-500/20 text-orange-300 border-orange-500/30'
            } backdrop-blur-sm font-medium`}>
              {project.category}
            </Badge>
          </div>

          {/* Stats Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
              <div className="text-xs text-gray-300">{project.stats.label}</div>
              <div className="text-sm font-bold text-white">{project.stats.value}</div>
            </div>
          </div>
        </div>

        <CardHeader className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${project.color} bg-opacity-10 border border-opacity-20`}>
                <project.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {project.shortDescription}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-orange-500/20 hover:text-orange-400 shrink-0"
              onClick={() => onOpenModal(project)}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">
            {project.detailedDescription}
          </p>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              Key Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {project.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-orange-400" />
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs px-3 py-1 bg-neutral-800/80 text-slate-400 border-neutral-600/50 hover:border-neutral-500/50 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default function PortfolioSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 md:px-8 bg-[#0A0A0A] text-slate-100 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-5" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent opacity-50" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
            </div>
            <Badge className="border-orange-500/50 text-orange-400 bg-orange-950/50 px-4 py-2 text-sm font-medium">
              Our Work
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-6"
          >
            Featured <span className="text-orange-500">Projects</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-300/80 max-w-4xl mx-auto leading-relaxed"
          >
            Explore our latest work where we transform innovative ideas into powerful digital experiences that drive real business results.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10"
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onOpenModal={openModal}
            />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16 md:mt-20"
        >
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-neutral-900/80 to-neutral-800/80 border border-neutral-700/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-orange-400" />
              <div className="text-left">
                <p className="text-sm text-slate-300">Ready to start your project?</p>
                <p className="text-lg font-semibold text-slate-100">Let's create something amazing together</p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 transition-all duration-300 font-semibold group shadow-lg shadow-orange-500/25"
              onClick={() => window.open('/contact', '_blank')}
            >
              <span className="flex items-center">
                Get Started
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
} 