"use client";

import Image from 'next/image';
import Link from 'next/link';
// import { ShimmerButton } from '@/components/magicui/ShimmerButton'; // No longer using ShimmerButton here
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// Variants for the header hide/show animation
const headerVariants: Variants = {
  visible: { y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  hidden: { y: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State for header visibility
  const lastScrollYRef = useRef(0); // Ref for last scroll position

  useEffect(() => {
    const headerHeight = 72; // Approx height md:h-18 (4.5rem = 72px)

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Existing logic for background style
      setIsScrolled(currentScrollY > 20);

      // New logic for hide/show header
      if (currentScrollY <= headerHeight) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    // Initialize ref on mount
    lastScrollYRef.current = window.scrollY;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const mobileNavLinkClasses = "text-slate-100 hover:text-orange-400 text-2xl font-light py-4 transition-all duration-300 tracking-wide";

  const menuVariants: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  };
  
  const navItems = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const quoteButtonBaseClasses = 
    "font-medium rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const quoteButtonDesktopClasses = 
    `px-5 py-2 text-sm text-orange-400 border border-orange-500/70 hover:bg-orange-500/10 hover:text-orange-300 hover:border-orange-400 ${quoteButtonBaseClasses}`;
  const quoteButtonMenuClasses = 
    `w-full py-3 text-base text-orange-400 border border-orange-500/70 hover:bg-orange-500/10 hover:text-orange-300 hover:border-orange-400 ${quoteButtonBaseClasses}`;

  return (
    <>
      <motion.header // Changed to motion.header
        variants={headerVariants}
        animate={isHeaderVisible ? "visible" : "hidden"}
        initial="visible"
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-out h-16 md:h-18 flex items-center
          ${isScrolled 
            ? 'bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/60' 
            : 'bg-black/80 backdrop-blur-md'
          }
          before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] before:pointer-events-none
          after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-orange-500/20 after:to-transparent
          supports-[backdrop-filter]:bg-opacity-90`}
      >
        <div className="container relative flex max-w-screen-2xl items-center justify-between px-6 md:px-8 h-full">
          {/* Left Slot: Hamburger Menu Toggle */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="bg-transparent text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-all duration-300 rounded-lg w-10 h-10 border-0 flex items-center justify-center p-0"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} /> 
            </button>
          </div>

          {/* Center Slot: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/zeropoint-logo.png"
                  alt="Zero Point Labs Logo"
                  width={250}
                  height={300}
                  className="rounded-lg transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>
          
          {/* Right Slot: Get a Quote Button (Desktop) */}
          <div className="flex-shrink-0 w-10 h-10 md:w-auto md:h-auto flex items-center justify-center">
            <div className="hidden md:block">
              <Link href="/get-a-quote" className={quoteButtonDesktopClasses}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Minimal Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-out Panel */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 z-[100] w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="text-slate-100 font-light text-lg tracking-wide">Menu</div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-orange-400 hover:bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center p-0 border-0"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-2 flex-grow">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  >
                    <Link 
                      href={item.href} 
                      className={mobileNavLinkClasses} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                className="mt-auto pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Link href="/get-a-quote" className={quoteButtonMenuClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  Get a Quote
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 