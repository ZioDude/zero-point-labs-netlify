"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Rocket,
  Code,
  Globe,
  ShoppingCart,
  Briefcase,
  User,
  Mail,
  Phone,
  MessageCircle,
  Smartphone,
  Monitor,
  Zap,
  Settings,
  Clock
} from "lucide-react";

interface MultistepFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Main choice
  mainChoice: string; // 'website', 'webapp', 'custom'
  
  // Website specific
  websiteType: string; // 'simple', 'ecommerce', 'complex'
  
  // Web App specific
  appPlatform: string; // 'mobile', 'web', 'both'
  appDescription: string;
  
  // Custom code specific
  customDescription: string;
  customTemplate: string;
  
  // Common fields
  budget: string;
  timeline: string;
  existingPresence: string;
  inspiration: string;
  preferredPlatform: string;
  
  // Contact info
  name: string;
  email: string;
  phone: string;
}

const mainChoices = [
  { 
    id: "website", 
    title: "Website", 
    subtitle: "Including online stores",
    icon: Globe 
  },
  { 
    id: "webapp", 
    title: "Web Application", 
    subtitle: "Custom software solution",
    icon: Monitor 
  },
  { 
    id: "custom", 
    title: "Custom Code", 
    subtitle: "Automation & integrations",
    icon: Code 
  },
];

const websiteTypes = [
  { 
    id: "simple", 
    title: "Simple Informational Site", 
    subtitle: "Just pages and text",
    budget: "$350–$600+",
    timeline: "~7 days"
  },
  { 
    id: "ecommerce", 
    title: "Online Store", 
    subtitle: "E-commerce functionality",
    budget: "$500–$1,200+",
    timeline: "~7 days"
  },
  { 
    id: "complex", 
    title: "Complex Website", 
    subtitle: "Lead capture, multiple pages, interactive features",
    budget: "$500–$1,000+",
    timeline: "~14 days"
  },
];

const appPlatforms = [
  { id: "mobile", title: "Mobile App", subtitle: "iOS & Android" },
  { id: "web", title: "Web App", subtitle: "Browser-based" },
  { id: "both", title: "Both", subtitle: "Mobile + Web" }
];

const customTemplates = [
  { id: "crm", title: "CRM Sync", subtitle: "Connect your systems" },
  { id: "zapier", title: "Zapier Workflow", subtitle: "Automate tasks" },
  { id: "email", title: "Email Drip Campaign", subtitle: "Marketing automation" },
  { id: "integration", title: "Custom Integration", subtitle: "Connect anything" },
  { id: "other", title: "Something Else", subtitle: "I'll describe it" }
];

const timelineOptions = [
  { id: "asap", title: "ASAP", subtitle: "1-2 weeks" },
  { id: "fast", title: "Fast Track", subtitle: "2-4 weeks" },
  { id: "standard", title: "Standard", subtitle: "1-2 months" },
  { id: "flexible", title: "Flexible", subtitle: "2+ months" }
];

const existingPresenceOptions = [
  { id: "none", title: "No", subtitle: "Starting fresh" },
  { id: "yes", title: "Yes", subtitle: "I have existing online presence" }
];

const platformOptions = [
  { id: "no-preference", title: "No Preference", subtitle: "You choose what's best for my project" },
  { id: "nextjs", title: "Next.js", subtitle: "Modern, fast, developer-friendly" },
  { id: "wix", title: "Wix", subtitle: "Easy to edit yourself later" },
  { id: "shopify", title: "Shopify", subtitle: "Best for e-commerce" },
  { id: "wordpress", title: "WordPress", subtitle: "Most popular CMS" }
];

const budgetRanges = {
  webapp: [
    { id: "under1k", label: "Under $1K" },
    { id: "5k", label: "Around $5K" },
    { id: "10k", label: "Around $10K" },
    { id: "over20k", label: "Over $20K" }
  ],
  custom: [
    { id: "under500", label: "Under $500" },
    { id: "1k", label: "Around $1K" },
    { id: "5k", label: "Around $5K" },
    { id: "over10k", label: "Over $10K" }
  ]
};

export default function MultistepForm({ isOpen, onClose }: MultistepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    mainChoice: "",
    websiteType: "",
    appPlatform: "",
    appDescription: "",
    customDescription: "",
    customTemplate: "",
    budget: "",
    timeline: "",
    existingPresence: "",
    inspiration: "",
    preferredPlatform: "no-preference",
    name: "",
    email: "",
    phone: ""
  });

  const getTotalSteps = () => {
    if (formData.mainChoice === 'website') return 6; 
    if (formData.mainChoice === 'webapp') return 7;
    if (formData.mainChoice === 'custom') return 7;
    return 1; // Default to 1 if no choice made, to prevent errors before selection
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setFormData({
      mainChoice: "",
      websiteType: "",
      appPlatform: "",
      appDescription: "",
      customDescription: "",
      customTemplate: "",
      budget: "",
      timeline: "",
      existingPresence: "",
      inspiration: "",
      preferredPlatform: "no-preference",
      name: "",
      email: "",
      phone: ""
    });
  };

  const handleNext = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form data:", formData);
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Try to parse JSON, but handle cases where response might not be JSON (e.g. server error HTML page)
      let result;
      try {
        result = await response.json();
      } catch (e) {
        // If JSON parsing fails, throw an error with the response status
        throw new Error(`Request failed with status ${response.status}. Response was not valid JSON.`);
      }

      if (!response.ok) {
        let errorMessage = result?.error || `Request failed with status ${response.status}`;
        if (result?.details) {
          // Attempt to stringify details, but keep it concise for an alert
          try {
            const detailsString = JSON.stringify(result.details);
            errorMessage += ` (Details: ${detailsString.substring(0, 200)}${detailsString.length > 200 ? '...' : ''})`;
          } catch (e) {
            errorMessage += ` (Could not stringify details)`;
          }
        }
        throw new Error(errorMessage);
      }

      console.log('Form submitted successfully:', result);
      setIsSuccess(true);
      
    } catch (error: any) { 
      console.error('Form submission error:', error);
      const errorMessage = error?.message || 'There was an error submitting your form. Please try again.';
      alert(errorMessage);
    }
  };

  const handleClose = () => {
    onClose();
    if (isSuccess) {
      setTimeout(resetForm, 300);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow real-time formatting as user types
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.mainChoice !== "";
      case 2: 
        if (formData.mainChoice === 'website') return formData.websiteType !== "";
        if (formData.mainChoice === 'webapp') return formData.appDescription !== "";
        if (formData.mainChoice === 'custom') return formData.customDescription !== "" || formData.customTemplate !== "";
        return false;
      case 3:
        if (formData.mainChoice === 'webapp') return formData.appPlatform !== "";
        if (formData.mainChoice === 'website') return formData.timeline !== "";
        if (formData.mainChoice === 'custom') return formData.timeline !== "";
        return false;
      case 4:
        if (formData.mainChoice === 'webapp') return formData.existingPresence !== "";
        if (formData.existingPresence === 'yes') {
          return formData.inspiration !== "";
        }
        return formData.existingPresence !== "";
      case 5:
        if (formData.mainChoice === 'webapp') return formData.inspiration !== "";
        if (formData.mainChoice === 'website') return formData.preferredPlatform !== "";
        return formData.inspiration !== "";
      case 6:
        if (formData.mainChoice === 'webapp') return formData.budget !== "";
        if (formData.mainChoice === 'website') {
          // Validate name, email format, and require both
          return formData.name !== "" && 
                 validateName(formData.name) && 
                 formData.email !== "" && 
                 validateEmail(formData.email);
        }
        return formData.budget !== "";
      case 7:
        // Validate name, email format, and require both
        return formData.name !== "" && 
               validateName(formData.name) && 
               formData.email !== "" && 
               validateEmail(formData.email);
      default: return false;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const phoneDigits = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for 10 digits
    if (phoneDigits.length === 10) {
      return `(${phoneDigits.slice(0,3)}) ${phoneDigits.slice(3,6)}-${phoneDigits.slice(6)}`;
    }
    // Format as +1 (XXX) XXX-XXXX for 11 digits starting with 1
    else if (phoneDigits.length === 11 && phoneDigits[0] === '1') {
      return `+1 (${phoneDigits.slice(1,4)}) ${phoneDigits.slice(4,7)}-${phoneDigits.slice(7)}`;
    }
    
    return phone; // Return as-is if can't format
  };

  useEffect(() => {
    if (isOpen && !isSuccess) {
      const hasAnyData = formData.mainChoice || formData.name || formData.email;
      if (!hasAnyData) {
        resetForm();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = getTotalSteps();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-neutral-300 mb-4">
                We've received your project details and will contact you within 24 hours with a custom proposal.
              </p>
              <p className="text-sm text-neutral-400">
                Check your email for confirmation and next steps.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mt-6"
            >
              <Button 
                onClick={handleClose}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Close
              </Button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Get Started</h2>
                  <p className="text-sm text-neutral-400">Step {currentStep} of {totalSteps}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-4">
              <div className="w-full bg-neutral-800 rounded-full h-1">
                <div 
                  className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-80 overflow-y-auto">
              {/* Step 1: Main Choice */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">What would you like to create today?</h3>
                  <div className="space-y-2">
                    {mainChoices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => setFormData({ ...formData, mainChoice: choice.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.mainChoice === choice.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <choice.icon className="w-5 h-5" />
                          <div>
                            <div className="text-sm font-medium">{choice.title}</div>
                            <div className="text-xs text-neutral-400">{choice.subtitle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2A: Website Type */}
              {currentStep === 2 && formData.mainChoice === 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Great—what kind of website?</h3>
                  <div className="space-y-2">
                    {websiteTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, websiteType: type.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.websiteType === type.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{type.title}</div>
                        <div className="text-xs text-neutral-400">{type.subtitle}</div>
                        <div className="text-xs text-orange-400 mt-1">{type.budget} • {type.timeline}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2B: Web App Description */}
              {currentStep === 2 && formData.mainChoice === 'webapp' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Describe your app's purpose</h3>
                  <textarea
                    placeholder="Tell us what your app will do in a few sentences..."
                    value={formData.appDescription}
                    onChange={(e) => setFormData({ ...formData, appDescription: e.target.value })}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Step 2C: Custom Code Description */}
              {currentStep === 2 && formData.mainChoice === 'custom' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">What do you need?</h3>
                  
                  <p className="text-sm text-neutral-400 mb-3">Pick a popular option:</p>
                  <div className="space-y-2 mb-4">
                    {customTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setFormData({ ...formData, customTemplate: template.id })}
                        className={`w-full p-2 rounded-lg border text-left transition-colors ${
                          formData.customTemplate === template.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{template.title}</div>
                        <div className="text-xs text-neutral-400">{template.subtitle}</div>
                      </button>
                    ))}
                  </div>

                  {formData.customTemplate === 'other' && (
                    <textarea
                      placeholder="Describe your custom automation or code needs..."
                      value={formData.customDescription}
                      onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm resize-none"
                      rows={3}
                    />
                  )}
                </div>
              )}

              {/* Step 3A: Timeline (Website & Custom) */}
              {currentStep === 3 && formData.mainChoice !== 'webapp' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">What's your timeline?</h3>
                  <div className="space-y-2">
                    {timelineOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData({ ...formData, timeline: option.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.timeline === option.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4" />
                          <div>
                            <div className="text-sm font-medium">{option.title}</div>
                            <div className="text-xs text-neutral-400">{option.subtitle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3B: App Platform (Web App only) */}
              {currentStep === 3 && formData.mainChoice === 'webapp' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">What platform are you targeting?</h3>
                  <div className="space-y-2">
                    {appPlatforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setFormData({ ...formData, appPlatform: platform.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.appPlatform === platform.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{platform.title}</div>
                        <div className="text-xs text-neutral-400">{platform.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Existing Presence */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Do you already have a website or social media?
                  </h3>
                  <div className="space-y-2">
                    {existingPresenceOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData({ ...formData, existingPresence: option.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.existingPresence === option.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{option.title}</div>
                        <div className="text-xs text-neutral-400">{option.subtitle}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Show text input when "Yes" is selected */}
                  {formData.existingPresence === 'yes' && (
                    <div className="mt-4">
                      <textarea
                        placeholder="Please share links to your website, social media profiles, or any existing online presence..."
                        value={formData.inspiration} // Reusing inspiration field for existing links
                        onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 5A: Platform Preference (Website only) */}
              {currentStep === 5 && formData.mainChoice === 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Platform preference?</h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Different platforms offer different benefits. Wix is easiest for you to edit later, 
                    Next.js is fastest and most modern, Shopify is best for selling products, and WordPress 
                    is the most popular. We'll recommend the best option if you're unsure.
                  </p>
                  <div className="space-y-2">
                    {platformOptions.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setFormData({ ...formData, preferredPlatform: platform.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.preferredPlatform === platform.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{platform.title}</div>
                        <div className="text-xs text-neutral-400">{platform.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5B: Inspiration (Web App & Custom) */}
              {currentStep === 5 && formData.mainChoice !== 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    {formData.mainChoice === 'webapp' 
                      ? 'Any existing apps you love or want to model yours after?' 
                      : 'Any examples or inspiration you can share?'
                    }
                  </h3>
                  <textarea
                    placeholder="Share links or names of sites/apps you admire..."
                    value={formData.inspiration}
                    onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Step 6A: Contact Info (Website only) */}
              {currentStep === 6 && formData.mainChoice === 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Contact details</h3>
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Your full name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`bg-neutral-800 border-neutral-700 text-white ${
                          formData.name && !validateName(formData.name) 
                            ? 'border-red-500 focus:border-red-500' 
                            : ''
                        }`}
                      />
                      {formData.name && !validateName(formData.name) && (
                        <p className="text-red-400 text-xs mt-1">Name should only contain letters, spaces, hyphens, and apostrophes</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`bg-neutral-800 border-neutral-700 text-white ${
                          formData.email && !validateEmail(formData.email) 
                            ? 'border-red-500 focus:border-red-500' 
                            : ''
                        }`}
                      />
                      {formData.email && !validateEmail(formData.email) && (
                        <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Phone number (optional)"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="bg-neutral-800 border-neutral-700 text-white"
                      />
                      <p className="text-neutral-500 text-xs mt-1">Format: (123) 456-7890</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6B: Budget (Web App & Custom) */}
              {currentStep === 6 && formData.mainChoice !== 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Budget range?</h3>
                  <div className="space-y-2">
                    {(formData.mainChoice === 'webapp' ? budgetRanges.webapp : budgetRanges.custom).map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setFormData({ ...formData, budget: range.id })}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          formData.budget === range.id
                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                            : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                        }`}
                      >
                        <span className="text-sm font-medium">{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Contact Info (Web App & Custom) */}
              {currentStep === 7 && formData.mainChoice !== 'website' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Contact details</h3>
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Your full name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`bg-neutral-800 border-neutral-700 text-white ${
                          formData.name && !validateName(formData.name) 
                            ? 'border-red-500 focus:border-red-500' 
                            : ''
                        }`}
                      />
                      {formData.name && !validateName(formData.name) && (
                        <p className="text-red-400 text-xs mt-1">Name should only contain letters, spaces, hyphens, and apostrophes</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`bg-neutral-800 border-neutral-700 text-white ${
                          formData.email && !validateEmail(formData.email) 
                            ? 'border-red-500 focus:border-red-500' 
                            : ''
                        }`}
                      />
                      {formData.email && !validateEmail(formData.email) && (
                        <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Phone number (optional)"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="bg-neutral-800 border-neutral-700 text-white"
                      />
                      <p className="text-neutral-500 text-xs mt-1">Format: (123) 456-7890</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-neutral-700 bg-neutral-900">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="text-neutral-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Submit
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
