
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { CardContent, CardHeader, CardTitle } from './Card';
import { Check, ArrowRight, Sparkles, Zap, BarChart3, Globe, Menu, X, Sun, Moon, PlayCircle, Laptop, Layout, Users, ShieldCheck } from 'lucide-react';
import { Spotlight } from './ui/Spotlight';
import { HoverEffect } from './ui/HoverEffect';
import { BackgroundGradient } from './ui/BackgroundGradient';
import { FlipText } from './ui/FlipText';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
  onLogin: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isDarkMode, toggleDarkMode }) => {
  const { companyName } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const words = ["Relationships", "Efficiency", "Intelligence", "Results"];

  const features = [
    {
      title: "AI Lead Scoring",
      description: "Stop guessing who to call next. Our AI analyzes thousands of behavioral signals to surface the leads ready to transact today, so you never waste time on cold prospects.",
      link: "#features",
      icon: <Sparkles className="h-8 w-8 text-primary" />
    },
    {
      title: "Predictive Analytics",
      description: "Be the smartest agent in the room. Access hyper-local market forecasts and neighborhood trends that position you as the trusted advisor your clients need.",
      link: "#features",
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Instant Automation",
      description: "Put your busywork on autopilot. From instant lead response to contract generation, automate 80% of your administrative tasks without writing a single line of code.",
      link: "#features",
      icon: <Zap className="h-8 w-8 text-yellow-500" />
    },
  ];

  const productSteps = [
    {
      title: "Your Daily Command Center",
      description: "Start every morning with clarity. Your personalized dashboard cuts through the noise, aggregating active deals, urgent tasks, and revenue goals into a single, distraction-free view.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      badge: "Dashboard",
      icon: <Layout className="h-5 w-5" />
    },
    {
      title: "A Pipeline That Actually Moves",
      description: "Visualize every opportunity. Our drag-and-drop pipeline helps you track deal stages, automate stage-change communications, and ensure no client ever slips through the cracks.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
      badge: "CRM",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "The White-Glove Client Portal",
      description: "Impress your clients with a branded experience. Give buyers and sellers a secure hub to view curated listings, sign documents, and communicate directly with you—24/7.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      badge: "Collaboration",
      icon: <ShieldCheck className="h-5 w-5" />
    }
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LogoIcon = ({ className }: { className?: string }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M2 22L12 12" />
      <path d="M22 22L12 12" />
      <path d="M12 2v20" />
      <path d="M8 22l4-10 4 10" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] selection:bg-primary/30 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-200 dark:border-white/[0.1] bg-white/80 dark:bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/50 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <LogoIcon className="h-6 w-6 text-primary fill-primary/20" />
            <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white leading-none">{companyName}</span>
                <span className="text-[10px] text-neutral-500 font-medium">Powered by Lexonit</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-primary dark:hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-primary dark:hover:text-white transition-colors">Product</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-primary dark:hover:text-white transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-primary dark:hover:text-white transition-colors">About</button>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-neutral-600 dark:text-neutral-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={onLogin} className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10">Log in</Button>
            <Button onClick={onLogin} className="bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 border-none">Get Started</Button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-neutral-600 dark:text-neutral-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-900 dark:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-black overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white">Features</button>
                <button onClick={() => scrollToSection('showcase')} className="text-left text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white">Product</button>
                <button onClick={() => scrollToSection('pricing')} className="text-left text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white">Pricing</button>
                <button onClick={() => scrollToSection('about')} className="text-left text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white">About</button>
                <div className="pt-4 flex flex-col gap-3">
                   <Button variant="ghost" onClick={onLogin} className="w-full justify-start text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10">Log in</Button>
                   <Button onClick={onLogin} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 border-none">Get Started</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill={isDarkMode ? "white" : "#7c3aed"} />
          
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-4 py-1.5 text-sm font-medium backdrop-blur-md mb-8 text-neutral-600 dark:text-neutral-300 shadow-lg"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              v2.0 Now Available: The AI Pilot Update
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60 pb-6 leading-tight max-w-4xl"
            >
              The Operating System for <br />
              <FlipText words={words} className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent font-extrabold pb-2" />
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 font-normal text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-center mx-auto mb-10 leading-relaxed"
            >
              Stop juggling spreadsheets and generic tools. {companyName} combines predictive AI, automated workflows, and a world-class client portal into one seamless platform designed to help you close deals faster.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-none shadow-xl shadow-black/5 dark:shadow-white/5" onClick={onLogin}>
                Start 14-Day Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base font-medium border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white bg-white/50 dark:bg-black/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-sm"
                onClick={() => scrollToSection('showcase')}
              >
                View Live Demo
              </Button>
            </motion.div>

            {/* Floating Video Hero */}
            <motion.div
               initial={{ opacity: 0, y: 40, rotateX: 20 }}
               animate={{ opacity: 1, y: 0, rotateX: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="relative w-full max-w-5xl aspect-video rounded-xl border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden group cursor-pointer perspective-1000"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
               <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative">
                  {/* Mock UI Interface */}
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                    alt="Dashboard Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <PlayCircle className="h-10 w-10 text-white fill-white/20" />
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-neutral-50 dark:bg-black relative transition-colors duration-300">
           <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] transition-colors duration-300"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">
                Why Top Producers Choose {companyName}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-xl">
                We've automated the busywork so you can focus on what you do best: building relationships and closing deals.
              </p>
            </div>
            
            <HoverEffect items={features} />
          </div>
        </section>

        {/* Product Showcase Journey Section */}
        <section id="showcase" className="py-24 bg-white dark:bg-zinc-950/50 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">
                Streamlined Workflow from <br/><span className="text-primary">Lead to Close</span>
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-xl">
                Experience a platform designed to move as fast as your business does.
              </p>
            </div>

            <div className="space-y-24 md:space-y-32">
              {productSteps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                  {/* Text Content */}
                  <div className={cn(
                    "flex-1 space-y-6 md:space-y-8",
                    index % 2 === 1 ? "md:order-2" : "md:order-1"
                  )}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {step.icon}
                      {step.badge}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium">Real-time data synchronization</span>
                      </li>
                      <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium">Mobile-optimized interface</span>
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Button variant="outline" className="rounded-full group" onClick={onLogin}>
                        Explore Feature <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>

                  {/* Screenshot Image */}
                  <div className={cn(
                    "flex-1 w-full",
                    index % 2 === 1 ? "md:order-1" : "md:order-2"
                  )}>
                    <div className="relative rounded-xl bg-neutral-900/5 dark:bg-white/5 p-2 lg:p-4 ring-1 ring-inset ring-neutral-900/10 dark:ring-white/10 lg:rounded-2xl lg:ring-1 lg:ring-white/10">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 shadow-2xl">
                        {/* Browser Chrome */}
                        <div className="absolute top-0 w-full h-8 bg-neutral-200 dark:bg-neutral-900 flex items-center px-4 gap-2 z-10">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 text-center text-[10px] text-neutral-500 font-mono opacity-50">
                            reallex-crm.com/app/{step.badge.toLowerCase()}
                          </div>
                        </div>
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          className="absolute inset-0 top-8 w-full h-[calc(100%-2rem)] object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -z-10 -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />
                      <div className="absolute -z-10 -top-10 -left-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl opacity-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative bg-white dark:bg-black/50 transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">Simple, Transparent Pricing</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-xl">Choose the plan that fits your agency size. No hidden fees.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col shadow-lg dark:shadow-none transition-colors duration-300">
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Starter</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">$0<span className="text-lg font-normal text-neutral-500 dark:text-neutral-400">/mo</span></div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Perfect for solo agents just starting out.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Up to 500 Leads</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Basic CRM Dashboard</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Email Support</li>
                        <li className="flex items-center text-neutral-400 dark:text-neutral-600"><Check className="h-5 w-5 mr-3" /> AI Insights</li>
                    </ul>
                    </CardContent>
                    <div className="mt-8">
                    <Button variant="outline" className="w-full rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 h-12" onClick={onLogin}>Get Started</Button>
                    </div>
                </div>
              </BackgroundGradient>

              {/* Pro Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900" containerClassName="md:scale-105 z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden shadow-xl dark:shadow-none transition-colors duration-300">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                    </div>
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Pro Agent</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">$79<span className="text-lg font-normal text-neutral-500 dark:text-neutral-400">/mo</span></div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">For serious agents scaling their business.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Unlimited Leads</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> AI Lead Scoring</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Automated Workflows</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Priority Support</li>
                    </ul>
                    </CardContent>
                    <div className="mt-8">
                    <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white border-none h-12 font-semibold" onClick={onLogin}>Start 14-Day Trial</Button>
                    </div>
                </div>
              </BackgroundGradient>

              {/* Agency Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col shadow-lg dark:shadow-none transition-colors duration-300">
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Agency</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">$199<span className="text-lg font-normal text-neutral-500 dark:text-neutral-400">/mo</span></div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Complete solution for brokerages.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Everything in Pro</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Team Management</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> White Labeling</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> API Access</li>
                    </ul>
                    </CardContent>
                    <div className="mt-8">
                    <Button variant="outline" className="w-full rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 h-12" onClick={onLogin}>Contact Sales</Button>
                    </div>
                </div>
              </BackgroundGradient>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-neutral-100 dark:bg-zinc-900/30 transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-neutral-900 dark:text-white">
                  Built by Agents, <br/>For Agents.
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6 leading-relaxed">
                  {companyName} wasn't born in a corporate boardroom. It was built by agents who were tired of choosing between clunky enterprise software and fragmented single-purpose tools. We believe that every agent, regardless of their brokerage size, deserves the best technology to serve their clients.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-10 leading-relaxed">
                  Our mission is to democratize real estate intelligence. We combine decades of industry experience with top-tier AI engineering to deliver a platform that doesn't just manage leads—it helps you build a business that lasts.
                </p>
                <Button className="rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 h-12 px-8 font-semibold" onClick={onLogin}>
                  Join Our Mission
                </Button>
              </div>
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                 <div className="relative rounded-xl overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-white/10 aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.1] opacity-50" />
                    <Globe className="h-24 w-24 text-neutral-400 dark:text-neutral-700 relative z-10" />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-white/[0.1] py-12 bg-white dark:bg-black transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LogoIcon className="h-6 w-6 text-primary fill-primary/20" />
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-neutral-900 dark:text-white leading-none">{companyName}</span>
                    <span className="text-[10px] text-neutral-500 font-medium">Powered by Lexonit</span>
                </div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Empowering real estate professionals with next-generation AI tools to close more deals, faster.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white text-lg">Product</h3>
              <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary dark:hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary dark:hover:text-white transition-colors">Pricing</button></li>
                <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white text-lg">Company</h3>
              <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary dark:hover:text-white transition-colors">About Us</button></li>
                <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white text-lg">Connect</h3>
              <div className="flex space-x-4">
                 <Globe className="h-6 w-6 text-neutral-400 hover:text-primary dark:hover:text-white cursor-pointer transition-colors" />
                 <div className="h-6 w-6 rounded-full border border-neutral-400 hover:border-primary dark:hover:border-white cursor-pointer" />
                 <div className="h-6 w-6 rounded-full border border-neutral-400 hover:border-primary dark:hover:border-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-neutral-200 dark:border-white/[0.1] text-center text-sm text-neutral-500">
            © 2024 {companyName} Inc. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};
