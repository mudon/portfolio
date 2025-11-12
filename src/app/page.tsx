"use client";

import React, { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent } from 'react';
import {
  Github, Linkedin, Mail, ExternalLink, Code, Cpu, Wrench, ChevronDown,
  Phone, MapPin, Send, Briefcase, Calendar, MapPinIcon, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Model from './hazim';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Html } from '@react-three/drei';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ProjectImage {
  url: string;
  alt: string;
}

interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
  gifs: ProjectImage[];
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  color: 'violet' | 'fuchsia' | 'cyan';
}

// GIF Modal Component
const GifModal = ({ 
  gifs, 
  initialIndex, 
  isOpen, 
  onClose 
}: { 
  gifs: ProjectImage[]; 
  initialIndex: number;
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextGif = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % gifs.length);
  }, [gifs.length]);

  const prevGif = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + gifs.length) % gifs.length);
  }, [gifs.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prevGif();
          break;
        case 'ArrowRight':
          nextGif();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prevGif, nextGif, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 dark-glass p-3 rounded-full hover:scale-110 transition-transform duration-300"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] w-full mx-4">
        {/* Navigation Arrows */}
        {gifs.length > 1 && (
          <>
            <button
              onClick={prevGif}
              className="absolute left-4 top-1/2 -translate-y-1/2 dark-glass p-4 rounded-full hover:scale-110 transition-transform duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextGif}
              className="absolute right-4 top-1/2 -translate-y-1/2 dark-glass p-4 rounded-full hover:scale-110 transition-transform duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Main GIF */}
        <img
          src={gifs[currentIndex].url}
          alt={gifs[currentIndex].alt}
          className="w-full h-full max-h-[80vh] object-contain rounded-lg"
        />

        {/* GIF Counter */}
        {gifs.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 dark-glass px-4 py-2 rounded-full text-white text-sm">
            {currentIndex + 1} / {gifs.length}
          </div>
        )}

        {/* Thumbnails */}
        {gifs.length > 1 && (
          <div className="flex gap-2 justify-center mt-4 overflow-x-auto py-2">
            {gifs.map((gif, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'border-violet-500 scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={gif.url}
                  alt={gif.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Project GIF Section Component
const ProjectGifSection = ({ 
  gifs, 
  projectTitle,
  onGifClick 
}: { 
  gifs: ProjectImage[]; 
  projectTitle: string;
  onGifClick: (index: number) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextGif = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % gifs.length);
  }, [gifs.length]);

  const prevGif = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + gifs.length) % gifs.length);
  }, [gifs.length]);

  // Auto-slide effect
  useEffect(() => {
    if (gifs.length <= 1 || isHovered) return;
    
    const interval = setInterval(nextGif, 4000);
    return () => clearInterval(interval);
  }, [gifs.length, nextGif, isHovered]);

  if (gifs.length === 0) return null;

  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 ${
        isHovered ? 'h-64 scale-105' : 'h-48'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onGifClick(currentIndex)}
    >
      {/* Main GIF */}
      <img
        src={gifs[currentIndex].url}
        alt={gifs[currentIndex].alt}
        className="w-full h-full object-cover transition-all duration-500"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div className={`${
          isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
        } transition-all duration-300 dark-glass px-4 py-2 rounded-full`}>
          <span className="text-white text-sm font-medium">Click to expand</span>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      {gifs.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevGif();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 dark-glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextGif();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 dark-glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}
      
      {/* Dots Indicator */}
      {gifs.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {gifs.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* GIF Badge */}
      <div className="absolute top-2 right-2 dark-glass px-2 py-1 rounded-full">
        <span className="text-xs text-violet-300 font-medium">GIF</span>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'sending' | 'sent' | ''>('');
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    gifs: ProjectImage[];
    currentIndex: number;
  }>({
    isOpen: false,
    gifs: [],
    currentIndex: 0
  });
  
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rotatingWords: string[] = ['secure', 'modern', 'scalable', 'elegant', 'powerful'];

    // Scroll functions that work immediately
  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to approximate position
      const projectsSection = document.querySelector('[data-section="projects"]');
      if (projectsSection) {
        projectsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to approximate position
      const contactSection = document.querySelector('[data-section="contact"]');
      if (contactSection) {
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // GSAP Animations
  useEffect(() => {
    // Hero section animations
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.hero-buttons',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );

    // Section animations with ScrollTrigger
    gsap.fromTo('.about-section',
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.skill-card',
      { opacity: 0, scale: 0.8, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.project-card',
      { opacity: 0, y: 80, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-section',
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Enhanced Timeline animations
    timelineItemsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(item,
        {
          opacity: 0,
          x: -50,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate the dot with a nice bounce effect
      const dot = item.querySelector('.timeline-dot');
      if (dot) {
        gsap.fromTo(dot,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Stagger the achievements
      const achievements = item.querySelectorAll('.achievement-item');
      achievements.forEach((achievement, achievementIndex) => {
        gsap.fromTo(achievement,
          {
            opacity: 0,
            x: -20
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: 0.3 + achievementIndex * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    // Magnetic button effect
    const buttons = document.querySelectorAll('.magnetic-button');
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gsap.to(button, {
          x: (x - rect.width / 2) * 0.2,
          y: (y - rect.height / 2) * 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const word = rotatingWords[currentWordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrollY(window.scrollY);

      if (timelineRef.current) {
        const timelineElement = timelineRef.current;
        const rect = timelineElement.getBoundingClientRect();
        const timelineTop = rect.top + window.scrollY;
        const timelineFullHeight = rect.height;
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        const scrollProgress = viewportCenter - timelineTop;
        const percentage = Math.min(Math.max((scrollProgress / timelineFullHeight) * 100, 0), 100);

        setTimelineHeight(percentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormStatus('sending');

    const tl = gsap.timeline();
    tl.to('.contact-form', {
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in'
    })
    .to('.contact-form', {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });
    
    const message = `New Contact Form Submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    const response = await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.NEXT_PUBLIC_CHAT_ID, text: message }),
    });

    if (!response.ok) 
    {
      setFormStatus('');
      throw new Error('Failed to send message');
    }

    setFormStatus('sent');
    setFormData({ name: '', email: '', message: '' });

    
    // Animate form submission
   
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openGifModal = (gifs: ProjectImage[], startIndex: number) => {
    setModalState({
      isOpen: true,
      gifs,
      currentIndex: startIndex
    });
  };

  const closeGifModal = () => {
    setModalState({
      isOpen: false,
      gifs: [],
      currentIndex: 0
    });
  };

  const skills = {
    software: [
      'JavaScript/TypeScript', 
      'React', 
      'Node.js',
      'Nextjs', 
      'Laravel', 
      'Flutter', 
      'Python', 
      'C++', 
      'SQL', 
      'Postgresql',
      'Mongodb',
      'Git', 
    ],
    mechanical: [
      'CAD (SolidWorks/AutoCAD)', 
      'FEA Analysis', 
      'Machine Troubleshooting', 
    ],
    tools: [
      'MATLAB',
      'Arduino/Raspberry Pi'
    ]
  };

  const projects: Project[] = [
    {
      title: 'Voice-to-text (Whisper + Silero) with Gemini',
      category: 'Linux App',
      description: 'Developed an AI application that transcribes audio using Whisper and Silero for VAD, with the transcribed text fed into Gemini for analysis or responses.',
      tech: ['Gemini model', 'Silero model', 'Whisper model', 'Python', 'React'],
      gradient: 'from-purple-900/20 via-violet-900/20 to-fuchsia-900/20',
      gifs: [
        {
          url: 'gifs/vtt.gif',
          alt: 'Transcribing youtube video'
        }
      ]
    },
    {
      title: 'Face Recognition',
      category: 'Machine Learning',
      description: 'Built a real-time face detection system leveraging ArchFace models for accurate recognition.',
      tech: ['ArchFace model', 'Python'],
      gradient: 'from-blue-900/20 via-cyan-900/20 to-indigo-900/20',
      gifs: [
        {
          url: 'gifs/face-recognition.gif',
          alt: 'Face recognition'
        }
      ]
    },
    {
      title: 'Authentication With BetterAuth',
      category: 'Authentication apps',
      description: 'Implemented an authentication system managed via Flutter (JWT) and React (session management) using NextJs and BetterAuth.',
      tech: ['NextJs', 'React', 'Flutter', 'Drizzle ORM (PostgreSQL)'],
      gradient: 'from-emerald-900/20 via-teal-900/20 to-green-900/20',
      gifs: [
        {
          url: 'gifs/web-next-login.gif',
          alt: 'Website authentication session management with BetterAuth'
        },
        {
          url: 'gifs/flutter-next-login.gif',
          alt: 'Flutter authentication JWT with BetterAuth'
        }
      ]
    },
    {
      title: 'Authentication From Scratch',
      category: 'Authentication apps',
      description: 'Developed a fully custom authentication app using session management with Redis.',
      tech: ['React', 'Python', 'Redis', 'MySQL'],
      gradient: 'from-orange-900/20 via-red-900/20 to-amber-900/20',
      gifs: [
        {
          url: 'gifs/python-scratch-login.gif',
          alt: 'Python redis authentication from scratch'
        }
      ]
    },
    {
      title: 'Langgraph Basic Tree Structure',
      category: 'AI Agent',
      description: 'Created a foundational AI agent using Langgraph for structured task execution.',
      tech: ['Python', 'Langgraph'],
      gradient: 'from-indigo-900/20 via-purple-900/20 to-violet-900/20',
      gifs: [
        {
          url: 'gifs/ai-agent-structure.gif',
          alt: 'Structure of Ai agent'
        }
      ]
    },
    {
      title: 'Godot Game',
      category: 'Game',
      description: 'Designed a walking game for portfolio purposes but decided to pause development to maintain website performance.',
      tech: ['Godot Engine'],
      gradient: 'from-teal-900/20 via-cyan-900/20 to-blue-900/20',
      gifs: [
        {
          url: 'gifs/godot-part-1.gif',
          alt: 'Godot part 1'
        },
        {
          url: 'gifs/godot-part-2.gif',
          alt: 'Godot part 2'
        },
        {
          url: 'gifs/godot-part-3.gif',
          alt: 'Godot part 3'
        }
      ]
    }
  ];

  const experiences: Experience[] = [
    {
      company: 'Senfficient Sdn Bhd, Penang',
      position: 'Software Engineer',
      duration: 'May 2023 - Present',
      location: 'Penang, Malaysia',
      description: 'Developing scalable web applications and automated solutions for manufacturing processes.',
      achievements: [
        'Delivered full-stack web applications using JavaScript (front-end) and Node.js (back-end) ensuring high performance.',
        'Designed and managed MySQL and MongoDB databases for efficient data storage and retrieval.',
        'Optimized MySQL queries to reduce response times and improve application performance.',
        'Built RESTful APIs to streamline communication between front-end and back-end systems.',
        'Applied Object-Oriented Design (OOD) principles to create modular, maintainable codebases.',
        'Actively contributed to all phases of the software development life cycle (SDLC).'
      ],
      color: 'violet'
    },
    {
      company: 'Hotayi Sdn Bhd, Penang',
      position: 'Mechanical Engineer',
      duration: 'Aug 2021 - May 2023',
      location: 'Penang, Malaysia',
      description: 'Maintained and improved industrial machinery, supporting production efficiency and equipment reliability.',
      achievements: [
        'Performed repair, maintenance, and troubleshooting on various industrial machines.',
        'Analyzed recurring mechanical issues and implemented preventive and corrective actions.',
        'Monitored production quality and supported process improvements to reduce defects.',
        'Participated in machine upgrades, including installation of sensors and automation components.',
        'Maintained technical documentation and provided guidance on safe equipment usage.',
        'Conducted root cause analysis for machinery failures to enhance reliability and minimize downtime.'
      ],
      color: 'fuchsia'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'violet':
        return {
          gradient: 'from-violet-500/20 via-purple-500/10 to-fuchsia-500/10',
          dot: 'bg-gradient-to-br from-violet-500 to-purple-600',
          glow: 'shadow-violet-500/50',
          text: 'text-violet-400'
        };
      case 'fuchsia':
        return {
          gradient: 'from-fuchsia-500/20 via-pink-500/10 to-rose-500/10',
          dot: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
          glow: 'shadow-fuchsia-500/50',
          text: 'text-fuchsia-400'
        };
      case 'cyan':
        return {
          gradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/10',
          dot: 'bg-gradient-to-br from-cyan-500 to-blue-600',
          glow: 'shadow-cyan-500/50',
          text: 'text-cyan-400'
        };
      default:
        return {
          gradient: 'from-violet-500/20 via-purple-500/10 to-fuchsia-500/10',
          dot: 'bg-gradient-to-br from-violet-500 to-purple-600',
          glow: 'shadow-violet-500/50',
          text: 'text-violet-400'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-950 text-slate-100 overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(192, 132, 252, 0.4);
            filter: brightness(1.2);
          }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes timelineProgress {
          0% { transform: scaleY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes liquidFlow {
          0% { 
            background-position: 0% 50%;
            filter: brightness(1) saturate(1);
          }
          50% { 
            background-position: 100% 50%;
            filter: brightness(1.1) saturate(1.2);
          }
          100% { 
            background-position: 0% 50%;
            filter: brightness(1) saturate(1);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-liquid {
          animation: liquidFlow 8s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .liquid-glass {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(192, 132, 252, 0.1) 25%,
            rgba(99, 102, 241, 0.15) 50%,
            rgba(168, 85, 247, 0.1) 75%,
            rgba(139, 92, 246, 0.15) 100%
          );
          background-size: 400% 400%;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.3),
            0 8px 32px 0 rgba(0, 0, 0, 0.36);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }
        .liquid-glass:hover::before {
          left: 100%;
        }
        .dark-glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.36),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
        .dark-glass:hover {
          border: 1px solid rgba(139, 92, 246, 0.4);
          box-shadow: 
            0 8px 32px 0 rgba(139, 92, 246, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
        }
        .timeline-line {
          background: linear-gradient(to bottom, 
            rgba(139, 92, 246, 0.8) 0%,
            rgba(192, 132, 252, 0.6) 30%,
            rgba(34, 211, 238, 0.6) 70%,
            rgba(6, 182, 212, 0.8) 100%);
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.3),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
        }
        .timeline-dot {
          box-shadow: 
            0 0 0 4px rgba(15, 23, 42, 0.8),
            0 0 20px currentColor;
        }
      `}</style>

      {/* GIF Modal */}
      <GifModal
        gifs={modalState.gifs}
        initialIndex={modalState.currentIndex}
        isOpen={modalState.isOpen}
        onClose={closeGifModal}
      />

      {/* Simplified Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-purple-600/5 blur-3xl"
          style={{
            top: '5%',
            right: '5%',
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-indigo-600/5 blur-3xl"
          style={{
            bottom: '10%',
            left: '5%',
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto">
          {/* 3D Model */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] mb-8 lg:mb-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
              <Suspense fallback={
                <Html center>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="dark-glass rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-violet-300">Loading 3D Model...</p>
                    </div>
                  </div>
                </Html>
              }>
                <ambientLight intensity={2.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
                <Model position={[0, -1.5, 0]} />
              </Suspense>
            </Canvas>
        </div>

          {/* Hero Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent relative">
                Muhammad Hazim Bin Hishamuddin
              </span>
            </h1>
            
            {/* Enhanced Liquid Glass Subtitle */}
            <div className="hero-subtitle inline-flex items-center gap-3 liquid-glass animate-liquid px-6 py-4 rounded-2xl mb-8">
              <Cpu className="w-6 h-6 text-violet-300 animate-pulse" />
              <span className="text-lg font-medium bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                Mechanical & Software Engineer
              </span>
              <Wrench className="w-6 h-6 text-fuchsia-300 animate-pulse" />
            </div>

            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                {[
                  { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&to=muhammadhazim57@gmail.com', text: 'muhammadhazim57@gmail.com' },
                  { icon: Phone, href: 'https://wa.me/60145197269', text: '+60 14-5197269' },
                  { icon: MapPin, text: 'Penang, Malaysia' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="dark-glass px-4 py-3 rounded-full flex items-center gap-2 text-slate-300 hover:text-violet-400 transition-all duration-300 magnetic-button group"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{item.text}</span>
                  </a>
                ))}
              </div>
              
              <p className="text-xl text-slate-250 mb-12 leading-relaxed hero-subtitle">
                Creating{' '}
                <span className="inline-block text-left">
                  <span className="font-bold text-3xl bg-gradient-to-r from-purple-200 to-fuchsia-400 bg-clip-text text-transparent">
                    {currentText}
                  </span>
                  <span className="typing-cursor font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">|</span>
                </span>
                {' '}solutions that bridge innovation and excellence.
              </p>
              
              <div className="hero-buttons flex gap-4 justify-center lg:justify-start">
                <button onClick={scrollToProjects} 
                className="magnetic-button px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-semibold hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105 animate-glow">
                  View Projects
                </button>
                <button onClick={scrollToContact}
                className="magnetic-button dark-glass px-8 py-4 rounded-full font-semibold hover:text-violet-400 transition-all duration-300">
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <ChevronDown className="absolute bottom-8 w-8 h-8 text-violet-400 animate-bounce mx-auto left-0 right-0" />
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-section py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="dark-glass rounded-3xl p-8 transition-all duration-500 h-full hover:scale-105 group">
                <Code className="w-12 h-12 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 text-white">Software Engineering</h3>
                <p className="text-slate-400 leading-relaxed">
                  Experienced in full-stack development and embedded systems. 
                  I build scalable applications and intelligent systems that solve real-world problems.
                </p>
              </div>
            </div>
            <div>
              <div className="dark-glass rounded-3xl p-8 transition-all duration-500 h-full hover:scale-105 group">
                <Wrench className="w-12 h-12 text-fuchsia-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 text-white">Mechanical Engineering</h3>
                <p className="text-slate-400 leading-relaxed">
                  Specialized in mechatronics, thermal systems, and manufacturing automation. 
                  From CAD design to prototyping, I bring concepts to life with precision engineering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="skills-section py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Software Development', skills: skills.software, color: 'violet' },
              { title: 'Mechanical Engineering', skills: skills.mechanical, color: 'fuchsia' },
              { title: 'Automation', skills: skills.tools, color: 'fuchsia' },
            ].map((category, index) => (
              <div key={index} className="skill-card">
                <div className="dark-glass rounded-3xl p-8 transition-all duration-500 h-full hover:scale-105 group">
                  <h3 className={`text-2xl font-bold mb-6 text-${category.color}-400`}>
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="dark-glass px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section - Enhanced */}
      <section ref={experienceRef} className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>
          
          <div className="relative" ref={timelineRef}>
            {/* Enhanced Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 timeline-line rounded-full transform origin-top transition-all duration-1000 ease-out" 
                 style={{ transform: `scaleY(${timelineHeight / 100})` }} />
            
            <div className="space-y-16">
              {experiences.map((exp, i) => {
                const colorClasses = getColorClasses(exp.color);
                
                return (
                  <div 
                    key={i} 
                    ref={el => {timelineItemsRef.current[i] = el}}
                    className="relative pl-20 timeline-item group"
                  >
                    {/* Enhanced Timeline Dot */}
                    <div 
                      className={`absolute left-6 top-8 w-6 h-6 rounded-full timeline-dot ${colorClasses.dot} border-2 border-slate-900 transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse`}
                      style={{ 
                        color: exp.color === 'violet' ? '#8b5cf6' : 
                              exp.color === 'fuchsia' ? '#d946ef' : '#06b6d4'
                      }}
                    />
                    
                    {/* Enhanced Content Card */}
                    <div 
                      className={`dark-glass rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group/card bg-gradient-to-br ${colorClasses.gradient}`}
                    >
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Briefcase 
                                className={`w-6 h-6 ${colorClasses.text} transition-transform duration-300 group-hover:scale-110`}
                              />
                              <h3 className="text-2xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                                {exp.position}
                              </h3>
                            </div>
                            <div 
                              className={`text-xl font-semibold mb-4 inline-block px-4 py-2 rounded-full dark-glass ${colorClasses.text} border ${colorClasses.glow} transition-all duration-300 group-hover:scale-105`}
                            >
                              {exp.company}
                            </div>
                            <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                              {exp.description}
                            </p>
                          </div>
                          <div className="md:ml-8 md:text-right flex-shrink-0 space-y-2">
                            <div className="dark-glass px-4 py-2 rounded-full inline-flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">{exp.duration}</span>
                            </div>
                            <div className="dark-glass px-4 py-2 rounded-full inline-flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                              <MapPinIcon className="w-4 h-4" />
                              <span className="text-sm">{exp.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                          <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide group-hover:text-slate-400 transition-colors duration-300">
                            Key Achievements
                          </h4>
                          <ul className="space-y-3">
                            {exp.achievements.map((achievement, j) => (
                              <li 
                                key={j} 
                                className="flex items-start gap-3 achievement-item group/achievement"
                              >
                                <div 
                                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-all duration-300 group-hover/achievement:scale-150 ${colorClasses.dot}`}
                                />
                                <span className="text-slate-400 leading-relaxed group-hover/achievement:text-slate-300 transition-all duration-300 group-hover/achievement:translate-x-1">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section with GIFs */}
      <section ref={projectsRef} className="projects-section py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="project-card">
                <div className={`dark-glass bg-gradient-to-br ${project.gradient} rounded-3xl p-8 transition-all duration-500 hover:scale-105 h-full flex flex-col group`}>
                  {/* Project Content - At the top */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-violet-400 mb-2 font-medium">{project.category}</div>
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-400 hover:text-violet-400 transition-colors cursor-pointer group-hover:scale-110" />
                    </div>
                    <p className="text-slate-400 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, j) => (
                        <span key={j} className="dark-glass px-3 py-1 rounded-full text-xs text-slate-300 hover:scale-105 transition-transform">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* GIF Section - At the bottom */}
                  <div className="mt-8">
                    <ProjectGifSection 
                      gifs={project.gifs} 
                      projectTitle={project.title}
                      onGifClick={(index) => openGifModal(project.gifs, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Let's Connect
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 text-center">
            Interested in collaboration or have a project in mind? Let's talk!
          </p>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, label: 'Email', value: 'muhammadhazim57@gmail.com',  href: 'https://mail.google.com/mail/?view=cm&to=muhammadhazim57@gmail.com', color: 'violet' },
              { icon: Phone, label: 'Phone', value: '+60 14-5197269', href: 'https://wa.me/60145197269', color: 'fuchsia' },
              { icon: MapPin, label: 'Location', value: 'Penang, Malaysia', color: 'cyan' }
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="dark-glass flex flex-col items-center p-6 rounded-3xl transition-all duration-300 hover:scale-105 magnetic-button group"
              >
                <item.icon className={`w-8 h-8 text-${item.color}-400 mb-3 group-hover:scale-110 transition-transform`} />
                <span className="text-sm text-slate-500 mb-1">{item.label}</span>
                <span className="text-slate-300 text-sm text-center">{item.value}</span>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <div className="dark-glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Send Me a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
                  { id: 'email', label: 'Your Email', type: 'email', placeholder: 'your.email@example.com' },
                  { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell me about your project or inquiry...' }
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-400 mb-2">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof FormData]}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="dark-glass w-full px-4 py-3 rounded-2xl focus:outline-none text-slate-100 placeholder-slate-500 transition-all resize-none focus:ring-2 focus:ring-violet-500/50"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof FormData]}
                        onChange={handleChange}
                        required
                        className="dark-glass w-full px-4 py-3 rounded-2xl focus:outline-none text-slate-100 placeholder-slate-500 transition-all focus:ring-2 focus:ring-violet-500/50"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-glow"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : formStatus === 'sent' ? (
                    <>
                      <span>✓</span> Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center mt-12">
            {[
              { icon: Github, href: 'https://github.com', color: 'hover:text-violet-400' },
              { icon: Linkedin, href: 'https://linkedin.com/in/muhammad-hazim-hishamuddin-bin-hishamuddin-71234212b', color: 'hover:text-cyan-400' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`dark-glass p-4 rounded-2xl hover:scale-110 transition-all duration-300 ${social.color}`}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-violet-900/50 text-center text-slate-500">
        <p>© 2025 Muhammad Hazim Bin Hishamuddin. Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
}