"use client";

import React, { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent, useMemo } from 'react';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Model from './hazim';
import { Html } from '@react-three/drei';

import {
  Github, Linkedin, Mail, ExternalLink, Code, Cpu, Wrench, ChevronDown,
  Phone, MapPin, Send, Briefcase, Calendar, MapPinIcon, X, ChevronLeft, ChevronRight,
  Sparkles, Cloud, Zap, Heart, Play, Star
} from 'lucide-react';


interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ProjectMedia {
  url: string;
  alt: string;
  type: 'video' | 'image';
}

interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
  media: ProjectMedia[];
}

// Video Modal Component (Cartoon Style)
const VideoModal = ({ 
  media, 
  initialIndex, 
  isOpen, 
  onClose 
}: { 
  media: ProjectMedia[]; 
  initialIndex: number;
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextMedia = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      currentVideo.pause();
    }
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length, currentIndex, media]);

  const prevMedia = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      currentVideo.pause();
    }
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length, currentIndex, media]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
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
          prevMedia();
          break;
        case 'ArrowRight':
          nextMedia();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prevMedia, nextMedia, onClose]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      currentVideo.play().catch(console.error);
    }
  }, [currentIndex, media]);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 comic-button p-4 rounded-full"
        style={{ background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)' }}
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] w-full mx-4">
        {media.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 comic-button p-4 rounded-full"
              style={{ background: 'linear-gradient(45deg, #4ECDC4, #6A89CC)' }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 comic-button p-4 rounded-full"
              style={{ background: 'linear-gradient(45deg, #4ECDC4, #6A89CC)' }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        <div className="cartoon-border-thick bg-white rounded-3xl p-4">
          <div className="w-full h-full max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden">
            {currentMedia.type === 'video' ? (
              <video
                ref={el => { videoRefs.current[currentIndex] = el }}
                src={currentMedia.url}
                className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                controls
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.alt}
                loading="lazy"
                className="w-full h-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>

        {media.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 comic-button px-4 py-2 rounded-full text-white text-sm font-black">
            {currentIndex + 1} / {media.length}
          </div>
        )}

        {media.length > 1 && (
          <div className="flex gap-3 justify-center mt-6 overflow-x-auto py-2">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  const currentVideo = videoRefs.current[currentIndex];
                  if (currentVideo && media[currentIndex].type === 'video') {
                    currentVideo.pause();
                  }
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cartoon-border transition-all duration-300 ${
                  index === currentIndex 
                    ? 'border-4 border-yellow-400 scale-110' 
                    : 'border-2 border-gray-400 hover:border-yellow-300'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <Play className="absolute inset-0 m-auto w-6 h-6 text-white opacity-70" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Media Section Component (Cartoon Style)
const ProjectMediaSection = ({ 
  media, 
  projectTitle,
  onMediaClick 
}: { 
  media: ProjectMedia[]; 
  projectTitle: string;
  onMediaClick: (index: number) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextMedia = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length, currentIndex, media]);

  const prevMedia = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length, currentIndex, media]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && media[currentIndex].type === 'video') {
      if (isHovered) {
        currentVideo.play().catch(console.error);
      } else {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
    }
  }, [isHovered, currentIndex, media]);

  if (media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden group cursor-pointer h-48 cartoon-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMediaClick(currentIndex)}
    >
      {currentMedia.type === 'video' ? (
        <video
          ref={el => { videoRefs.current[currentIndex] = el }}
          src={currentMedia.url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={currentMedia.url}
          alt={currentMedia.alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
        <div className="comic-button px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-sm font-black">CLICK TO EXPAND!</span>
        </div>
      </div>
      
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevMedia();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 comic-button p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(45deg, #4ECDC4, #6A89CC)' }}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMedia();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 comic-button p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(45deg, #4ECDC4, #6A89CC)' }}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}
      
      {media.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                const currentVideo = videoRefs.current[currentIndex];
                if (currentVideo && media[currentIndex].type === 'video') {
                  currentVideo.pause();
                  currentVideo.currentTime = 0;
                }
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/80 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-2 right-2 comic-button px-2 py-1 rounded-full">
        <span className="text-xs text-white font-black">
          {currentMedia.type === 'video' ? '🎬 VIDEO' : '🖼️ IMAGE'}
        </span>
      </div>
    </div>
  );
};

const useThrottledScroll = (throttleMs: number = 8) => {
  const [scrollY, setScrollY] = useState<number>(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      lastScrollYRef.current = currentScrollY;

      if (!scrollTimeoutRef.current) {
        scrollTimeoutRef.current = window.setTimeout(() => {
          setScrollY(lastScrollYRef.current);
          scrollTimeoutRef.current = null;
        }, throttleMs);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [throttleMs]);

  return scrollY;
};

export default function CartoonPortfolio() {
  const scrollY = useThrottledScroll(8);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'sending' | 'sent' | ''>('');
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    media: ProjectMedia[];
    currentIndex: number;
  }>({
    isOpen: false,
    media: [],
    currentIndex: 0
  });
  
  const [visibleSections, setVisibleSections] = useState<{
    about: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
    contact: boolean;
  }>({
    about: false,
    skills: false,
    experience: false,
    projects: false,
    contact: false
  });
  
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const rotatingWords: string[] = useMemo(() => ['magical', 'fun', 'creative', 'playful', 'amazing'], []);

  const scrollToProjects = useCallback(() => {
    setVisibleSections(prev => ({ 
      ...prev, 
      about: true,
      skills: true,
      experience: true,
      projects: true 
    }));
    
    setTimeout(() => {
      if (projectsRef.current) {
        projectsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  }, []);

  const scrollToContact = useCallback(() => {
    setVisibleSections(prev => ({ 
      ...prev, 
      about: true,
      skills: true,
      experience: true,
      projects: true,
      contact: true 
    }));
    
    setTimeout(() => {
      if (contactRef.current) {
        contactRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.01
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName) {
            setVisibleSections(prev => ({ ...prev, [sectionName]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = [
      { ref: aboutRef, name: 'about' },
      { ref: skillsRef, name: 'skills' },
      { ref: experienceRef, name: 'experience' },
      { ref: projectsRef, name: 'projects' },
      { ref: contactRef, name: 'contact' }
    ];

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
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
  }, [currentText, isDeleting, currentWordIndex, rotatingWords]);

  // Improved timeline animation
  useEffect(() => {
    const updateTimelineHeight = () => {
      if (timelineRef.current) {
        const timelineElement = timelineRef.current;
        const rect = timelineElement.getBoundingClientRect();
        const timelineTop = rect.top + window.scrollY;
        const timelineBottom = rect.bottom + window.scrollY;
        const timelineHeight = rect.height;
        
        // Calculate when timeline enters viewport
        const viewportTop = window.scrollY;
        const viewportBottom = window.scrollY + window.innerHeight;
        
        // Calculate progress based on viewport center
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        const timelineStart = timelineTop - window.innerHeight / 2;
        const timelineEnd = timelineBottom - window.innerHeight / 2;
        
        let progress = 0;
        
        if (viewportCenter > timelineStart && viewportCenter < timelineEnd) {
          progress = ((viewportCenter - timelineStart) / (timelineEnd - timelineStart)) * 100;
        } else if (viewportCenter >= timelineEnd) {
          progress = 100;
        }
        
        setTimelineHeight(Math.min(Math.max(progress, 0), 100));
      }
    };

    updateTimelineHeight();
  }, [scrollY]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormStatus('sending');
    
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
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openMediaModal = useCallback((media: ProjectMedia[], startIndex: number) => {
    setModalState({
      isOpen: true,
      media,
      currentIndex: startIndex
    });
  }, []);

  const closeMediaModal = useCallback(() => {
    setModalState({
      isOpen: false,
      media: [],
      currentIndex: 0
    });
  }, []);

  const skills = useMemo(() => ({
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
  }), []);

  // Update projects with Mickey Mouse colors
  const projects: Project[] = useMemo(() => [
    {
      title: 'Voice-to-text (Whisper + Silero) with Gemini',
      category: 'Linux App',
      description: 'Developed an AI application that transcribes audio using Whisper and Silero for VAD, with the transcribed text fed into Gemini for analysis or responses.',
      tech: ['Gemini model', 'Silero model', 'Whisper model', 'Python', 'React'],
      gradient: 'from-red-500 to-red-600',
      media: [
        {
          url: 'videos/vtt.mp4',
          alt: 'Transcribing youtube video',
          type: 'video'
        }
      ]
    },
    {
      title: 'Face Recognition',
      category: 'Machine Learning',
      description: 'Built a real-time face detection system leveraging ArchFace models for accurate recognition.',
      tech: ['ArchFace model', 'Python'],
      gradient: 'from-yellow-500 to-yellow-600',
      media: [
        {
          url: 'videos/face-recognition.mp4',
          alt: 'Face recognition',
          type: 'video'
        }
      ]
    },
    {
      title: 'Authentication With BetterAuth',
      category: 'Authentication apps',
      description: 'Implemented an authentication system managed via Flutter (JWT) and React (session management) using NextJs and BetterAuth.',
      tech: ['NextJs', 'React', 'Flutter', 'Drizzle ORM (PostgreSQL)'],
      gradient: 'from-red-500 to-black',
      media: [
        {
          url: 'videos/web-next-login.mp4',
          alt: 'Website authentication session management with BetterAuth',
          type: 'video'
        },
        {
          url: 'videos/flutter-next-login.mp4',
          alt: 'Flutter authentication JWT with BetterAuth',
          type: 'video'
        }
      ]
    },
    {
      title: 'Authentication From Scratch',
      category: 'Authentication apps',
      description: 'Developed a fully custom authentication app using session management with Redis.',
      tech: ['React', 'Python', 'Redis', 'MySQL'],
      gradient: 'from-yellow-500 to-red-500',
      media: [
        {
          url: 'videos/python-scratch-login.mp4',
          alt: 'Python redis authentication from scratch',
          type: 'video'
        }
      ]
    },
    {
      title: 'Ai agent using langgraph',
      category: 'AI Agent',
      description: 'Created a foundational AI agent using Langgraph for structured task execution.',
      tech: ['Python', 'Langgraph'],
      gradient: 'from-black to-red-500',
      media: [
        {
          url: 'videos/ai-agent.mp4',
          alt: 'Structure of Ai agent',
          type: 'video'
        }
      ]
    },
    {
      title: 'Godot Game',
      category: 'Game',
      description: 'Designed a walking game for portfolio purposes but decided to pause development to maintain website performance.',
      tech: ['Godot Engine'],
      gradient: 'from-red-500 to-yellow-500',
      media: [
        {
          url: 'videos/godot-part-1.mp4',
          alt: 'Godot part 1',
          type: 'video'
        },
        {
          url: 'videos/godot-part-2.mp4',
          alt: 'Godot part 2',
          type: 'video'
        },
        {
          url: 'videos/godot-part-3.mp4',
          alt: 'Godot part 3',
          type: 'video'
        }
      ]
    }
  ], []);

  const experiences = useMemo(() => [
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
  ], []);

  const getColorClasses = useCallback((color: string) => {
    switch (color) {
      case 'violet':
        return {
          gradient: 'from-violet-400 to-purple-500',
          dot: 'bg-gradient-to-br from-violet-500 to-purple-600',
          text: 'text-violet-600',
          border: 'border-violet-500'
        };
      case 'fuchsia':
        return {
          gradient: 'from-fuchsia-400 to-pink-500',
          dot: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
          text: 'text-fuchsia-600',
          border: 'border-fuchsia-500'
        };
      case 'cyan':
        return {
          gradient: 'from-cyan-400 to-blue-500',
          dot: 'bg-gradient-to-br from-cyan-500 to-blue-600',
          text: 'text-cyan-600',
          border: 'border-cyan-500'
        };
      default:
        return {
          gradient: 'from-violet-400 to-purple-500',
          dot: 'bg-gradient-to-br from-violet-500 to-purple-600',
          text: 'text-violet-600',
          border: 'border-violet-500'
        };
    }
  }, []);

  // Floating elements animation
  const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div 
      className="floating-element"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  // Mickey Mouse Head Background Element
  const MickeyHead = ({ size, position, color = 'red' }: { size: string; position: string; color?: string }) => (
    <div className={`absolute ${position} ${size} rounded-full bg-${color}-500 mickey-glow`}></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-2deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 10px currentColor);
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 20px currentColor);
            transform: scale(1.05);
          }
        }
        
        @keyframes mickey-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes timeline-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .bounce-element {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .wiggle-element {
          animation: wiggle 3s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .mickey-spin {
          animation: mickey-spin 20s linear infinite;
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .timeline-grow {
          animation: timeline-grow 1.5s ease-out forwards;
          transform-origin: top;
        }
        
        .mickey-border {
          border: 4px solid #000;
          box-shadow: 
            8px 8px 0 #000,
            0 0 20px rgba(255, 0, 0, 0.3);
          background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
        }
        
        .mickey-border-thick {
          border: 6px solid #000;
          box-shadow: 
            12px 12px 0 #000,
            0 0 30px rgba(255, 0, 0, 0.4);
          background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
        }
        
        .mickey-button {
          background: linear-gradient(45deg, #FF0000, #CC0000);
          border: 3px solid #000;
          box-shadow: 
            6px 6px 0 #000,
            0 0 15px rgba(255, 0, 0, 0.5);
          transition: all 0.2s ease;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: white;
        }
        
        .mickey-button:hover {
          transform: translate(4px, 4px);
          box-shadow: 
            2px 2px 0 #000,
            0 0 20px rgba(255, 0, 0, 0.7);
          background: linear-gradient(45deg, #CC0000, #990000);
        }
        
        .mickey-card {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 4px solid #000;
          box-shadow: 
            8px 8px 0 #000,
            0 0 20px rgba(255, 215, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .mickey-card:hover {
          transform: translate(4px, 4px);
          box-shadow: 
            4px 4px 0 #000,
            0 0 30px rgba(255, 215, 0, 0.4);
        }
        
        .mickey-glow {
          box-shadow: 
            0 0 50px rgba(255, 0, 0, 0.6),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }
        
        .mickey-timeline-line {
          background: linear-gradient(to bottom, #FF0000, #FFD700, #FFFFFF);
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          transform-origin: top;
          transition: transform 0.1s ease-out;
        }
        
        .mickey-timeline-dot {
          border: 4px solid #000;
          box-shadow: 
            3px 3px 0 #000,
            0 0 15px currentColor;
          transition: all 0.3s ease;
        }
        
        .mickey-dotted-border {
          border: 3px dashed #FFD700;
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
        }
        
        .mickey-speech-bubble {
          position: relative;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 3px solid #FFD700;
          border-radius: 30px;
          box-shadow: 
            6px 6px 0 #000,
            0 0 20px rgba(255, 215, 0, 0.3);
        }
        
        .starry-bg {
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
        }

        .timeline-dot-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Video Modal */}
      <VideoModal
        media={modalState.media}
        initialIndex={modalState.currentIndex}
        isOpen={modalState.isOpen}
        onClose={closeMediaModal}
      />

      {/* Mickey Mouse Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 starry-bg">
        {/* Mickey Heads */}
        <MickeyHead size="w-32 h-32" position="top-10 left-10" color="red" />
        <MickeyHead size="w-24 h-24" position="top-40 right-20" color="yellow" />
        <MickeyHead size="w-28 h-28" position="bottom-40 left-20" color="red" />
        <MickeyHead size="w-20 h-20" position="bottom-20 right-32" color="yellow" />
        
        {/* Animated Stars */}
        <FloatingElement delay={0}>
          <div className="absolute top-1/4 left-1/4">
            <Star className="w-8 h-8 text-yellow-400 sparkle" />
          </div>
        </FloatingElement>
        <FloatingElement delay={1}>
          <div className="absolute top-1/3 right-1/3">
            <Star className="w-6 h-6 text-red-400 sparkle" />
          </div>
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute bottom-1/4 left-1/3">
            <Star className="w-10 h-10 text-yellow-300 sparkle" />
          </div>
        </FloatingElement>
        
        {/* Floating Mickey Ears */}
        <div className="absolute top-20 right-20 wiggle-element">
          <div className="w-16 h-16 bg-red-500 rounded-full mickey-glow"></div>
        </div>
        <div className="absolute bottom-32 left-32 bounce-element">
          <div className="w-12 h-12 bg-yellow-500 rounded-full mickey-glow"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative px-6 py-20 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-15">
          {/* 3D Model in Mickey Frame */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] mb-8 lg:mb-0">
            <div className="mickey-border-thick rounded-3xl p-6 h-full relative">
              {/* Mickey Ears Decoration */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-red-500 rounded-full mickey-glow"></div>
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-red-500 rounded-full mickey-glow"></div>
              
              <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
                <Suspense fallback={
                  <Html center>
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-red-400 font-bold">Loading 3D Model...</p>
                    </div>
                  </Html>
                }>
                  <ambientLight intensity={2.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                  <pointLight position={[-10, -10, -10]} intensity={1} color="#FF0000" />
                  <Model position={[0, -1.5, 0]} />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Hero Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Mickey Speech Bubble */}
            <div className="mickey-speech-bubble p-8 mb-8">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4 bounce-element" />
              <h1 className="text-5xl md:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  MUHAMMAD HAZIM
                </span>
              </h1>
              <div className="text-2xl font-bold text-yellow-200 mb-4">
                Mechanical & Software Engineer
              </div>
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
                    className="mickey-button px-4 py-3 rounded-full flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-black">{item.text}</span>
                  </a>
                ))}
              </div>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-bold">
                Creating{' '}
                <span className="inline-block text-left">
                  <span className="font-black text-3xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                    {currentText}
                  </span>
                  <span className="typing-cursor font-black text-3xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">|</span>
                </span>
                {' '}solutions with magic! ✨
              </p>
              
              <div className="flex gap-4 justify-center lg:justify-start">
                <button onClick={scrollToProjects} 
                className="mickey-button px-8 py-4 rounded-2xl text-lg font-black">
                  🎨 View Projects
                </button>
                <button onClick={scrollToContact}
                className="mickey-button px-8 py-4 rounded-2xl text-lg font-black"
                style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)' }}>
                  💌 Get in Touch
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start gap-6 mt-8">
              {[
                { icon: Github, href: 'https://github.com' },
                { icon: Linkedin, href: 'https://linkedin.com/in/muhammad-hazim-hishamuddin-bin-hishamuddin-71234212b' }
              ].map((social, index) => (
                <div key={index} className="floating-element" style={{ animationDelay: `${index * 0.5}s` }}>
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mickey-border p-4 rounded-full block hover:scale-110 transition-transform"
                  >
                    <social.icon className="w-6 h-6 text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <ChevronDown className="absolute bottom-8 w-8 h-8 text-yellow-400 bounce-element mx-auto left-0 right-0" />
      </section>

      {/* About Section */}
      <section ref={aboutRef} data-section="about" className="py-20 px-6 relative z-10">
        {visibleSections.about ? (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                ABOUT ME 🎯
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mickey-card rounded-3xl p-8 h-full text-center">
                  <Code className="w-16 h-16 text-red-400 mx-auto mb-4 bounce-element" />
                  <h3 className="text-2xl font-black mb-4 text-white">Software Engineering</h3>
                  <p className="text-gray-300 leading-relaxed font-bold">
                    Experienced in full-stack development and embedded systems. 
                    I build scalable applications and intelligent systems that solve real-world problems.
                  </p>
                </div>
              </div>
              <div>
                <div className="mickey-card rounded-3xl p-8 h-full text-center">
                  <Wrench className="w-16 h-16 text-yellow-400 mx-auto mb-4 bounce-element" />
                  <h3 className="text-2xl font-black mb-4 text-white">Mechanical Engineering</h3>
                  <p className="text-gray-300 leading-relaxed font-bold">
                    Apply core mechanical engineering principles in the design, analysis, and improvement of systems and processes to enhance performance, reliability, and efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96"></div>
        )}
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} data-section="skills" className="py-20 px-6 relative z-10">
        {visibleSections.skills ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                SKILLS & EXPERTISE 🛠️
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Software Development', skills: skills.software, gradient: 'from-red-500 to-red-600', emoji: '💻' },
                { title: 'Mechanical Engineering', skills: skills.mechanical, gradient: 'from-yellow-500 to-yellow-600', emoji: '⚙️' },
                { title: 'Tools & Hardware', skills: skills.tools, gradient: 'from-red-500 to-yellow-500', emoji: '🔧' },
              ].map((category, index) => (
                <div key={index} className="mickey-card rounded-3xl p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${category.gradient} mickey-border rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{category.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-6 text-white">{category.title}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="mickey-dotted-border px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-96"></div>
        )}
      </section>

      {/* Work Experience Section */}
      <section ref={experienceRef} data-section="experience" className="py-20 px-6 relative z-10">
        {visibleSections.experience ? (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                WORK EXPERIENCE 💼
              </span>
            </h2>
            
            <div className="relative" ref={timelineRef}>
              {/* Animated Timeline Line */}
              <div 
                className="absolute left-8 top-0 bottom-0 w-3 mickey-timeline-line rounded-full" 
                style={{ 
                  transform: `scaleY(${timelineHeight / 100})`,
                  transformOrigin: 'top'
                }} 
              />
              
              <div className="space-y-16">
                {experiences.map((exp, i) => {
                  const colorClasses = getColorClasses(exp.color);
                  const isVisible = timelineHeight > (i * (100 / experiences.length));
                  
                  return (
                    <div 
                      key={i} 
                      ref={el => {timelineItemsRef.current[i] = el}}
                      className="relative pl-20"
                    >
                      <div 
                        className={`absolute left-6 top-8 w-8 h-8 rounded-full mickey-timeline-dot ${colorClasses.dot} ${
                          isVisible ? 'timeline-dot-pulse scale-110' : 'scale-90 opacity-70'
                        } transition-all duration-500`}
                        style={{ 
                          transitionDelay: `${i * 200}ms`,
                          transform: isVisible ? 'scale(1.1)' : 'scale(0.9)'
                        }}
                      />
                      
                      <div 
                        className={`mickey-card rounded-3xl p-8 transition-all duration-700 ${
                          isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'
                        }`}
                        style={{ transitionDelay: `${i * 300}ms` }}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Briefcase className={`w-6 h-6 ${colorClasses.text}`} />
                              <h3 className="text-2xl font-black text-white">{exp.position}</h3>
                            </div>
                            <div className={`text-xl font-black mb-4 inline-block px-4 py-2 rounded-full mickey-border ${colorClasses.text} bg-gray-900`}>
                              {exp.company}
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed font-bold">{exp.description}</p>
                          </div>
                          <div className="md:ml-8 md:text-right flex-shrink-0 space-y-2">
                            <div className="mickey-button px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span className="font-black">{exp.duration}</span>
                            </div>
                            <div className="mickey-button px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm"
                                 style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)' }}>
                              <MapPinIcon className="w-4 h-4" />
                              <span className="font-black">{exp.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t-2 border-dashed border-yellow-400">
                          <h4 className="text-sm font-black text-yellow-400 mb-4 uppercase tracking-wide">KEY ACHIEVEMENTS</h4>
                          <ul className="space-y-3">
                            {exp.achievements.map((achievement, j) => (
                              <li 
                                key={j} 
                                className="flex items-start gap-3 transition-all duration-500"
                                style={{ 
                                  transitionDelay: `${(i * 100) + (j * 100)}ms`,
                                  opacity: isVisible ? 1 : 0,
                                  transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${colorClasses.dot} mickey-timeline-dot`} />
                                <span className="text-gray-300 leading-relaxed font-bold">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96"></div>
        )}
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} data-section="projects" className="py-20 px-6 relative z-10">
        {visibleSections.projects ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                FEATURED PROJECTS 🚀
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="mickey-card rounded-3xl p-6 flex flex-col h-full min-h-[550px]">
                  {/* Header Content */}
                  <div className="flex-grow-0">
                    <div className={`w-16 h-16 bg-gradient-to-r ${project.gradient} mickey-border rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">
                        {project.title.includes('Voice') ? '🎤' : 
                         project.title.includes('Face') ? '👁️' : 
                         project.title.includes('Auth') ? '🔐' : 
                         project.title.includes('AI') ? '🤖' : '🎮'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-center mb-3 text-white">{project.title}</h3>
                    <p className="text-gray-300 text-center mb-4 font-bold">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="mickey-dotted-border px-3 py-1 rounded-full text-xs font-black">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section - Fixed Position */}
                  <div className="mt-auto">
                    {/* Project Media */}
                    <div className="mb-4">
                      <ProjectMediaSection 
                        media={project.media} 
                        projectTitle={project.title}
                        onMediaClick={(index) => openMediaModal(project.media, index)}
                      />
                    </div>
                    
                    {/* Button - Always at bottom */}
                    <button 
                      onClick={() => openMediaModal(project.media, 0)}
                      className="mickey-button w-full py-3 rounded-xl text-sm font-black mt-4"
                      disabled={project.media.length === 0}
                    >
                      {project.media.length === 0 ? 'NO VIDEOS 😢' : 'WATCH DEMO! 🎬'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-96"></div>
        )}
      </section>

      {/* Contact Section */}
      <section ref={contactRef} data-section="contact" className="py-20 px-6 relative z-10">
        {visibleSections.contact ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                LET'S CONNECT! 💬
              </span>
            </h2>
            
            <div className="mickey-border-thick rounded-3xl p-8">
              <div className="text-center mb-8">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4 pulse-glow" />
                <p className="text-xl font-black text-white">
                  Ready to create something magical together?
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Awesome Name"
                    className="mickey-border rounded-2xl p-4 w-full font-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500 bg-gray-800 text-white"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@super.cool"
                    className="mickey-border rounded-2xl p-4 w-full font-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500 bg-gray-800 text-white"
                    required
                  />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your magical idea..."
                  rows={5}
                  className="mickey-border rounded-2xl p-4 w-full font-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500 bg-gray-800 text-white resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="mickey-button w-full py-4 rounded-2xl text-lg font-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(45deg, #FF0000, #CC0000)' }}
                >
                  {formStatus === 'sending' ? 'SENDING... ✨' : 
                   formStatus === 'sent' ? 'MESSAGE SENT! 🎉' : 'SEND MESSAGE 🚀'}
                </button>
              </form>
              
              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[
                  { icon: Mail, text: 'muhammadhazim57@gmail.com', color: 'text-red-400', href: 'https://mail.google.com/mail/?view=cm&to=muhammadhazim57@gmail.com' },
                  { icon: Phone, text: '+60 14-5197269', color: 'text-yellow-400', href: 'https://wa.me/60145197269' },
                  { icon: MapPin, text: 'Penang, Malaysia', color: 'text-white' }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-2 font-black hover:scale-110 transition-transform text-white"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96"></div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center relative z-10">
        <div className="mickey-border rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <Heart className="w-6 h-6 text-red-400 bounce-element" />
            <span className="font-black text-lg text-white">Imitates Cartoon Style</span>
            <Heart className="w-6 h-6 text-yellow-400 bounce-element" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-gray-300 font-bold">© 2025 Muhammad Hazim - Full Stack Developer</p>
        </div>
      </footer>
    </div>
  );
}