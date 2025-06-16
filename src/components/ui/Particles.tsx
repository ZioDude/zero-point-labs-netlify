"use client";

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null); // Ref for the parent container
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Define initParticles BEFORE resizeCanvas
    const initParticles = () => {
      particlesRef.current = [];
      // Use window dimensions for particle density on full screen canvas
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 7500); 
      for (let i = 0; i < Math.min(numParticles, 150); i++) { 
        particlesRef.current.push(createParticle());
      }
    };

    const resizeCanvas = () => {
      // Canvas should be full screen
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); 
    };

    const createParticle = (): Particle => {
      const maxLife = 3000 + Math.random() * 4000;
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 50, 
        vx: (Math.random() - 0.5) * 0.1, // Slow X
        vy: -0.05 - Math.random() * 0.15, // Slow Y
        size: 0.5 + Math.random() * 0.7, // Intended small size (0.5px to 1.2px)
        opacity: 0.5 + Math.random() * 0.3, // Intended opacity
        life: 0,
        maxLife,
      };
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(parentRef.current);

    // updateParticles and drawParticles can be defined after initParticles 
    // as they are only called in the animate loop
    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 16; // Assuming 60fps

        // Fade out as particle ages
        const lifeRatio = particle.life / particle.maxLife;
        // Keep opacity somewhat consistent until the end, then fade
        particle.opacity = (0.5 + Math.random() * 0.5) * (1 - Math.pow(lifeRatio, 3));


        // Remove dead particles and create new ones if they go off top or sides of window
        if (particle.life >= particle.maxLife || 
            particle.y < -particle.size || 
            particle.x < -particle.size || 
            particle.x > window.innerWidth + particle.size
        ) {
          particlesRef.current[index] = createParticle();
        }
      });
    };

    const drawParticles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        context.save();
        context.globalAlpha = particle.opacity;
        
        // --- INTENDED ORANGE COLOR ---
        context.fillStyle = '#FFA500'; // Bright Orange
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles(); // Initial particle generation
    animate();

    return () => {
      resizeObserver.unobserve(parentRef.current); // Clean up ResizeObserver
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array, effect runs once on mount

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }} // Explicitly z-0 for particle layer
    />
  );
} 