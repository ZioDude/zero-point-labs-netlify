import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string; // Placeholder for project images
  projectUrl: string; // URL for the detailed project page
}

const sampleProjects: Project[] = [
  {
    id: 1,
    title: 'AI-Powered Data Analytics Platform',
    description: 'A cutting-edge platform leveraging machine learning to provide deep insights from complex datasets for enterprise clients.',
    imageUrl: '/placeholder-project-1.jpg', // Replace with actual image paths
    projectUrl: '/portfolio/project-1',
  },
  {
    id: 2,
    title: 'Next-Gen E-commerce Experience',
    description: 'Revolutionizing online shopping with a highly personalized and interactive e-commerce solution, built on a scalable microservices architecture.',
    imageUrl: '/placeholder-project-2.jpg',
    projectUrl: '/portfolio/project-2',
  },
  {
    id: 3,
    title: 'Sustainable Smart City Dashboard',
    description: 'An IoT-driven dashboard for urban planners to monitor and manage city resources efficiently, promoting sustainability and citizen well-being.',
    imageUrl: '/placeholder-project-3.jpg',
    projectUrl: '/portfolio/project-3',
  },
  {
    id: 4,
    title: 'Decentralized Finance (DeFi) Application',
    description: 'A secure and transparent DeFi platform offering innovative financial instruments and services on the blockchain.',
    imageUrl: '/placeholder-project-4.jpg',
    projectUrl: '/portfolio/project-4',
  },
  {
    id: 5,
    title: 'AR-Enhanced Educational Tool',
    description: 'An immersive augmented reality application that transforms traditional learning materials into interactive and engaging experiences.',
    imageUrl: '/placeholder-project-5.jpg',
    projectUrl: '/portfolio/project-5',
  },
  {
    id: 6,
    title: 'Automated Content Generation System',
    description: 'An AI system that assists creative professionals by automating parts of the content creation workflow, from ideation to final output.',
    imageUrl: '/placeholder-project-6.jpg',
    projectUrl: '/portfolio/project-6',
  },
];

const PortfolioSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          Our Portfolio Showcase
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {sampleProjects.map((project) => (
            <div
              key={project.id}
              className="bg-neutral-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 group"
            >
              <div className="relative h-56 md:h-64 w-full">
                {/* Placeholder for image - you can use Next/Image here */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-3 text-sky-400 group-hover:text-sky-300 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-neutral-300 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                <Link href={project.projectUrl} passHref>
                  <Button
                    variant="outline"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 transition-all duration-300 transform group-hover:translate-y-[-2px] group-hover:shadow-lg"
                  >
                    View Project Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
