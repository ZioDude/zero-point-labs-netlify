"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { AuroraText } from "@/components/magicui/aurora-text";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { WordRotate } from "@/components/magicui/WordRotate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import GridPattern from "@/components/magicui/GridPattern";
import { 
  ExternalLink, 
  Zap, 
  Monitor, 
  TrendingUp, 
  Users, 
  Target, 
  Code2, 
  Palette, 
  Rocket,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  Lightbulb,
  Heart,
  Shield,
  Star,
  MessageSquare
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMultistepFormContext } from "@/contexts/MultistepFormContext";

// Define the Project type
interface Project {
  id: number;
  name: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
  url: string;
  image: string;
  technologies: string[];
  features: string[];
  accentColor: string;
  stats: {
    label: string;
    value: string;
    icon: React.ElementType;
  }[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  highlights: string[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "G.P Realty",
    category: "Real Estate Platform",
    shortDescription: "Modern student housing platform",
    detailedDescription:
      "A comprehensive real estate platform designed specifically for university students seeking rental properties near their campuses. Features advanced search filters, virtual property tours, secure booking system, and seamless communication between students and property owners.",
    url: "https://gprealty.vercel.app/",
    image: "/gprealty.png",
    technologies: ["Next.js", "React", "Tailwind CSS", "Vercel", "PostgreSQL", "Stripe"],
    features: [
      "Property Search",
      "Virtual Tours",
      "Secure Booking",
      "Student Verification",
    ],
    accentColor: "blue",
    stats: [
      { label: "Active Listings", value: "500+", icon: Globe },
      { label: "Happy Students", value: "2.3k", icon: Users },
      { label: "Avg Response Time", value: "< 2h", icon: Clock },
    ],
    highlights: [
      "98% customer satisfaction rate",
      "Featured in TechCrunch Cyprus",
      "€1.2M in transactions processed"
    ],
    testimonial: {
      text: "Zero Point Labs transformed our vision into reality. The platform they built exceeded all expectations.",
      author: "George Papadopoulos",
      role: "CEO, G.P Realty"
    }
  },
  {
    id: 2,
    name: "Adverlead",
    category: "Marketing Automation",
    shortDescription: "AI-powered lead generation platform",
    detailedDescription:
      "An all-in-one marketing and lead generation platform featuring Lee, an AI assistant specifically crafted for renovation professionals. Automates Facebook ads, qualifies leads, books appointments, and manages entire marketing campaigns with intelligent automation.",
    url: "https://lee-ruby.vercel.app/",
    image: "/adverlead.png",
    technologies: ["React", "AI/ML", "Facebook API", "Node.js", "MongoDB", "OpenAI"],
    features: [
      "AI Assistant",
      "Ad Automation",
      "Lead Qualification",
      "Campaign Management",
    ],
    accentColor: "purple",
    stats: [
      { label: "Leads Generated", value: "10k+", icon: TrendingUp },
      { label: "ROI Increase", value: "312%", icon: Award },
      { label: "Time Saved", value: "40h/mo", icon: Clock },
    ],
    highlights: [
      "3x conversion rate improvement",
      "Automated 85% of lead qualification",
      "Reduced cost per lead by 67%"
    ],
    testimonial: {
      text: "The AI integration is mind-blowing. Our lead quality improved dramatically while reducing manual work.",
      author: "Maria Constantinou",
      role: "Marketing Director, RenovatePro"
    }
  },
  {
    id: 3,
    name: "Lead Gen Magic",
    category: "Marketing Agency",
    shortDescription: "Professional lead generation services",
    detailedDescription:
      "A full-service lead generation agency website showcasing magical marketing solutions for businesses. Features comprehensive service offerings, transparent pricing, client testimonials, and conversion-optimized landing pages designed to turn prospects into loyal customers.",
    url: "https://gitmcp.vercel.app/",
    image: "/leadgenmagic.png",
    technologies: ["Next.js", "Framer Motion", "Analytics", "A/B Testing", "Hotjar", "HubSpot"],
    features: [
      "Service Showcase",
      "Pricing Plans",
      "Lead Capture",
      "Analytics Dashboard",
    ],
    accentColor: "orange",
    stats: [
      { label: "Conversion Rate", value: "15%+", icon: Target },
      { label: "Client Retention", value: "94%", icon: Users },
      { label: "Avg Project Value", value: "€8.5k", icon: Award },
    ],
    highlights: [
      "Award-winning design",
      "15% conversion rate (3x industry avg)",
      "Generated €500k+ for clients"
    ],
    testimonial: {
      text: "Their website design and optimization strategies transformed our online presence completely.",
      author: "Andreas Nikolaou",
      role: "Founder, TechStart Cyprus"
    }
  },
];

// Floating particles component
const FloatingParticles = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowSize.width === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          animate={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// 3D Card tilt effect
const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -10;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

export default function PortfolioPage() {
  const [activeProject, setActiveProject] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { openForm } = useMultistepFormContext();

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextProject = () => {
    setIsAutoPlaying(false);
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setIsAutoPlaying(false);
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const project = projects[activeProject];

  // Parallax transforms
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <GridPattern
          width={50}
          height={50}
          x={-1}
          y={-1}
          className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] stroke-neutral-800/50 fill-neutral-900/30"
        />
        <FloatingParticles />
        
        {/* Dynamic gradient orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative z-10 pt-32 pb-20 text-center px-4"
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Award-Winning Portfolio</span>
          </motion.div>

          <AuroraText 
            colors={["#ff9900", "#ff6600", "#ffb347", "#ff9900"]} 
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-6"
            speed={2}
          >
            <span>Our Masterpieces</span>
          </AuroraText>
          
          <SparklesText 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white"
            sparklesCount={12}
            colors={{ first: "#ff9900", second: "#ff6600" }}
          >
            <span>Where Art Meets Code</span>
          </SparklesText>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <WordRotate
              words={[
                <span key="1" className="text-2xl md:text-3xl text-orange-400">✨ Stunning Designs</span>,
                <span key="2" className="text-2xl md:text-3xl text-purple-400">🚀 Lightning Fast</span>,
                <span key="3" className="text-2xl md:text-3xl text-blue-400">💎 Pixel Perfect</span>,
                <span key="4" className="text-2xl md:text-3xl text-green-400">📈 Results Driven</span>,
              ]}
              className="font-medium"
              duration={2000}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300/90 leading-relaxed"
          >
            Dive into our collection of cutting-edge digital experiences. Each project is a testament to our 
            commitment to excellence, innovation, and measurable business impact.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { label: "Projects Delivered", value: "150+", icon: Rocket },
              { label: "Happy Clients", value: "98%", icon: Users },
              { label: "Revenue Generated", value: "€2.5M+", icon: TrendingUp },
              { label: "Awards Won", value: "12", icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm"
              >
                <stat.icon className="w-6 h-6 text-orange-400" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Main Project Showcase - Masonry Grid Layout */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid mb-6"
            >
              <Card
                className="relative overflow-hidden bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl border border-neutral-800/50 shadow-xl hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group"
                onClick={() => window.open(project.url, '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5" />
                
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                  
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-orange-500/30">
                      <ExternalLink className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-orange-300 font-medium">Visit</span>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute bottom-4 left-4 z-30">
                    <Badge
                      className={`px-2.5 py-1 text-xs font-medium border-none ${
                        project.accentColor === 'blue'
                          ? 'bg-blue-500/80 text-white'
                          : project.accentColor === 'purple'
                          ? 'bg-purple-500/80 text-white'
                          : 'bg-orange-500/80 text-white'
                      }`}
                    >
                      {project.category}
                    </Badge>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {project.name}
                  </h3>
                  
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-neutral-800/60 text-slate-300 rounded border border-neutral-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs bg-neutral-800/60 text-slate-400 rounded border border-neutral-700/50">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Stats - Only for some projects to create variety */}
                  {index % 2 === 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {project.stats.slice(0, 2).map((stat, i) => (
                        <div key={i} className="text-center p-2 rounded-lg bg-neutral-800/30">
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-slate-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Achievement - Randomly show for variety */}
                  {index % 3 === 0 && project.highlights.length > 0 && (
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 mb-4">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-300">{project.highlights[0]}</p>
                      </div>
                    </div>
                  )}

                  {/* Testimonial - Only for featured projects */}
                  {project.testimonial && index === 0 && (
                    <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/5 to-purple-500/5 border border-orange-500/20 mb-4">
                      <blockquote className="text-sm text-slate-300 italic mb-2">
                        "{project.testimonial.text.slice(0, 100)}..."
                      </blockquote>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
                          {project.testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{project.testimonial.author}</div>
                          <div className="text-xs text-slate-400">{project.testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500 hover:to-orange-600 text-orange-300 hover:text-white border border-orange-500/30 hover:border-orange-500 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      View Project
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process & Values Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Us?
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We don't just build websites - we craft digital experiences that drive real business results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Lightbulb,
              title: "Innovation First",
              description: "We stay ahead of the curve with cutting-edge technologies and design trends.",
              color: "text-yellow-400",
              bgColor: "bg-yellow-500/10",
              borderColor: "border-yellow-500/20"
            },
            {
              icon: Heart,
              title: "Client-Centric",
              description: "Your success is our success. We listen, adapt, and deliver beyond expectations.",
              color: "text-red-400",
              bgColor: "bg-red-500/10",
              borderColor: "border-red-500/20"
            },
            {
              icon: Shield,
              title: "Quality Assured",
              description: "Rigorous testing and quality control ensure flawless performance every time.",
              color: "text-green-400",
              bgColor: "bg-green-500/10",
              borderColor: "border-green-500/20"
            },
            {
              icon: Rocket,
              title: "Fast Delivery",
              description: "We deliver high-quality projects on time, every time, without compromising quality.",
              color: "text-blue-400",
              bgColor: "bg-blue-500/10",
              borderColor: "border-blue-500/20"
            },
            {
              icon: TrendingUp,
              title: "Results Driven",
              description: "Every design decision is backed by data and focused on achieving your business goals.",
              color: "text-purple-400",
              bgColor: "bg-purple-500/10",
              borderColor: "border-purple-500/20"
            },
            {
              icon: Users,
              title: "Expert Team",
              description: "Our team of seasoned professionals brings years of experience to every project.",
              color: "text-orange-400",
              bgColor: "bg-orange-500/10",
              borderColor: "border-orange-500/20"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-blue-500/20 border border-orange-500/30 backdrop-blur-xl p-8 lg:p-12 text-center"
        >
          <BorderBeam
            size={150}
            duration={12}
            colorFrom="#F97316"
            colorTo="#8B5CF6"
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6"
            >
              <Star className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Ready to Start?</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Let's Build Something
              </span>
              <br />
              <SparklesText
                className="text-4xl md:text-5xl font-bold"
                colors={{ first: "#ff9900", second: "#ff6600" }}
                sparklesCount={8}
              >
                <span>Amazing Together</span>
              </SparklesText>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              Ready to transform your digital presence? Let's discuss your project and create something extraordinary that drives real results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={openForm}
                size="lg"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold px-8 py-4 text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Free consultation • No commitment</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
