"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Check, 
  ArrowRight, 
  Zap,
  Globe,
  Building2,
  Rocket,
  MessageCircle,
  Mail,
  BarChart3,
  Bot,
  Sparkles
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const pricingTiers = [
  {
    id: "basic",
    name: "Landing Page",
    price: "€350",
    period: "one-time",
    description: "Perfect for simple landing pages and portfolios",
    icon: Globe,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    buttonColor: "border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-500/10",
    features: [
      "Single page design",
      "Mobile responsive",
      "SEO optimized",
      "Contact form",
      "7 day delivery",
      "1 revision round",
      "1 year hosting included"
    ],
    popular: false
  },
  {
    id: "business",
    name: "Business Website",
    price: "€500",
    period: "one-time",
    description: "Complete business websites with advanced features",
    icon: Building2,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    buttonColor: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500",
    features: [
      "Multi-page website",
      "Advanced forms & integrations",
      "CMS setup",
      "Analytics integration",
      "Social media integration",
      "14 day delivery",
      "3 revision rounds",
      "1 year hosting & support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Web Application",
    price: "Let's Talk",
    period: "consultation",
    description: "Custom web applications tailored to your needs",
    icon: Rocket,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    buttonColor: "border-purple-500/50 text-purple-400 hover:border-purple-400 hover:bg-purple-500/10",
    features: [
      "Custom functionality",
      "Database integration",
      "User authentication",
      "API development",
      "Admin dashboard",
      "Timeline varies",
      "Unlimited revisions",
      "Ongoing support available"
    ],
    popular: false
  },
  {
    id: "automation",
    name: "Automation Suite",
    price: "€100+",
    period: "per automation",
    description: "Workflow automations and AI implementations",
    icon: Zap,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    buttonColor: "border-green-500/50 text-green-400 hover:border-green-400 hover:bg-green-500/10",
    features: [
      "Zapier integrations",
      "Email campaigns",
      "Lead management",
      "CRM automations",
      "AI implementations",
      "3-7 day setup",
      "Custom workflows",
      "Training included"
    ],
    popular: false
  }
];

const PricingCard = ({ tier, index }: { tier: typeof pricingTiers[0], index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative"
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <Card className={`h-full relative overflow-hidden ${
        tier.popular 
          ? 'bg-gradient-to-b from-orange-500/5 via-neutral-900/90 to-neutral-900/90 border-orange-500/40 shadow-xl shadow-orange-500/10' 
          : 'bg-neutral-900/50 border-neutral-700/50'
      } backdrop-blur-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group`}>
        
        {/* Background Glow Effect for Popular */}
        {tier.popular && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        )}
        {tier.popular && (
          <BorderBeam
            size={250}
            duration={6}
            delay={0}
            className="from-transparent via-orange-500 to-transparent"
          />
        )}
        
        <CardHeader className="p-6 pb-4 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${tier.bgColor} border ${tier.borderColor}`}>
              <tier.icon className={`w-6 h-6 ${tier.color}`} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-100">
                {tier.name}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {tier.description}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-bold text-slate-100">
                {tier.price}
              </span>
              <span className="text-slate-400 text-sm">
                {tier.period}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 0.3 + featureIndex * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full ${tier.bgColor} border ${tier.borderColor} flex items-center justify-center`}>
                  <Check className={`w-3 h-3 ${tier.color}`} />
                </div>
                <span className="text-slate-300">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <Link href={tier.id === "enterprise" ? "/contact" : "/start-project"}>
            <Button
              size="lg"
              className={`w-full group ${
                tier.popular 
                  ? tier.buttonColor + " shadow-lg shadow-orange-500/25"
                  : tier.buttonColor
              } transition-all duration-300 font-semibold py-3`}
              variant={tier.popular ? "default" : "outline"}
            >
              <span className="flex items-center justify-center">
                {tier.id === "enterprise" ? "Get Consultation" : "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function PricingSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 md:px-8 bg-[#0A0A0A] text-slate-100 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-10" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            </div>
            <Badge className="border-orange-500/50 text-orange-400 bg-orange-950/50 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium">
              Pricing
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-slate-100 mb-4 md:mb-6"
          >
            Simple, <span className="text-orange-500">Transparent</span> Pricing
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-300/80 max-w-3xl mx-auto leading-relaxed"
          >
            Choose the perfect plan for your project. No hidden fees, no surprises.
          </motion.p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <MessageCircle className="w-5 h-5 text-orange-400" />
              <span className="text-slate-300 text-sm">Free consultation included</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <Mail className="w-5 h-5 text-orange-400" />
              <span className="text-slate-300 text-sm">Email support included</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <Bot className="w-5 h-5 text-orange-400" />
              <span className="text-slate-300 text-sm">AI integrations available</span>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm mt-6 max-w-2xl mx-auto">
            All projects include free hosting for the first year. Need something custom? 
            <Link href="/contact" className="text-orange-400 hover:text-orange-300 ml-1 underline">
              Let's discuss your requirements
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 