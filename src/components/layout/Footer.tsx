"use client";

import React, { useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  Phone, 
  Globe,
  Heart,
  Sparkles,
  Bot,
  Code2,
  Zap,
  ExternalLink,
  Send
} from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Landing Pages", href: "/services/landing-pages", price: "€350" },
    { name: "Business Websites", href: "/services/business-websites", price: "€500" },
    { name: "Web Applications", href: "/services/web-apps", price: "Custom" },
    { name: "AI Integrations", href: "/services/ai-integrations", price: "€100+" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Process", href: "/process" },
    { name: "Contact", href: "/contact" },
  ];

  const resources = [
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Documentation", href: "/docs" },
    { name: "Support", href: "/support" },
  ];

  const socialLinks = [
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com/company/zeropointlabs", 
      icon: ExternalLink,
      color: "hover:text-blue-400" 
    },
    { 
      name: "GitHub", 
      href: "https://github.com/zeropointlabs", 
      icon: Code2,
      color: "hover:text-purple-400" 
    },
    { 
      name: "Email", 
      href: "mailto:hello@zeropointlabs.com", 
      icon: Mail,
      color: "hover:text-orange-400" 
    },
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative w-full bg-[#0A0A0A] text-slate-100 overflow-hidden border-t border-neutral-800/50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_60%,transparent_100%)] opacity-5" />
      
      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-4 h-4 bg-orange-500/20 rounded-full blur-sm"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "-2s" }}
        className="absolute top-40 right-20 w-6 h-6 bg-orange-500/15 rounded-full blur-sm"
      />

      <div className="container mx-auto max-w-7xl relative z-10 px-4 md:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Main Footer Content */}
          <div className="pt-16 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Company Info - Spans 5 columns */}
              <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/zeropoint-logo.png"
                      alt="Zero Point Labs"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">Zero Point Labs</h3>
                      <p className="text-sm text-slate-400">Crafting Digital Futures</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300/90 leading-relaxed max-w-md">
                    We transform digital visions into reality with cutting-edge web development, 
                    AI solutions, and modern design. Based in Cyprus, serving clients worldwide.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 bg-orange-500/15 border border-orange-500/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm">Cyprus, European Union</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 bg-orange-500/15 border border-orange-500/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-orange-400" />
                    </div>
                    <a href="mailto:hello@zeropointlabs.com" className="text-sm hover:text-orange-400 transition-colors">
                      hello@zeropointlabs.com
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 bg-orange-500/15 border border-orange-500/30 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm">Available Worldwide</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-neutral-800/50 border border-neutral-700/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-neutral-700/50 hover:border-orange-500/30 ${social.color} group`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services - Spans 2 columns */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Services</h4>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={service.name} className="group">
                      <Link 
                        href={service.href}
                        className="flex items-center justify-between text-slate-400 hover:text-orange-400 transition-colors duration-200"
                      >
                        <span className="text-sm">{service.name}</span>
                        <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400 bg-orange-500/5">
                          {service.price}
                        </Badge>
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Company - Spans 2 columns */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Company</h4>
                <div className="space-y-3">
                  {company.map((item, index) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className="block text-sm text-slate-400 hover:text-orange-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Resources - Spans 3 columns */}
              <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
                <h4 className="text-lg font-semibold text-slate-100">Stay Updated</h4>
                
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    Get the latest updates on web development trends, AI innovations, and our newest projects.
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-neutral-800/80 transition-all duration-200"
                    />
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-0 px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-300">Resources</h5>
                  {resources.map((resource, index) => (
                    <Link 
                      key={resource.name}
                      href={resource.href}
                      className="block text-sm text-slate-400 hover:text-orange-400 transition-colors duration-200"
                    >
                      {resource.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="py-8 border-t border-neutral-800/50">
            <div className="relative">
              <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/80 border border-orange-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm overflow-hidden">
                <BorderBeam
                  size={250}
                  duration={12}
                  delay={0}
                  colorFrom="#F97316"
                  colorTo="#F97316"
                />
                
                <div className="grid md:grid-cols-2 gap-6 items-center relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                      <h3 className="text-xl font-bold text-slate-100">Ready to Start Your Project?</h3>
                    </div>
                    <p className="text-slate-300/90 leading-relaxed">
                      Let's bring your digital vision to life. From landing pages to complex web applications, 
                      we've got the expertise to make it happen.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 md:justify-end">
                    <Button 
                      variant="outline" 
                      className="border-orange-500/50 text-orange-400 hover:border-orange-400 hover:bg-orange-500/10"
                      asChild
                    >
                      <Link href="/portfolio">
                        View Work
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25"
                      asChild
                    >
                      <Link href="/contact">
                        Get Started
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div variants={itemVariants} className="py-6 border-t border-neutral-800/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>&copy; {currentYear} Zero Point Labs. All rights reserved.</span>
                <div className="hidden md:flex items-center gap-2">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>in Cyprus</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <Link href="/privacy" className="text-slate-400 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-orange-400 transition-colors">
                  Terms of Service
                </Link>
                <div className="flex items-center gap-2 text-slate-400">
                  <Bot className="w-4 h-4 text-orange-400" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
} 