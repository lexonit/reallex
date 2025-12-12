
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { CardContent, CardHeader, CardTitle } from '../components/Card';
import { Check, ArrowRight, Sparkles, Zap, BarChart3, Globe, Menu, X, Sun, Moon, PlayCircle, Laptop, Layout, Users, ShieldCheck, Twitter, Linkedin, Settings, Wrench, Clock, Award, Lock, Zap as Lightning } from 'lucide-react';
import { Spotlight } from '../components/ui/Spotlight';
import { HoverEffect } from '../components/ui/HoverEffect';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { FlipText } from '../components/ui/FlipText';
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
  const words = ["Custom Solutions", "In-House Control", "Enterprise Ready", "Complete Support"];

  const features = [
    {
      title: "Fully Customizable Platform",
      description: "Build exactly what you need. White-label interfaces, custom workflows, and unlimited configurations - all deployed on your infrastructure for complete control and privacy.",
      link: "#features",
      icon: <Settings className="h-8 w-8 text-primary" />
    },
    {
      title: "Production Ready Deployment",
      description: "Enterprise-grade architecture built for scale. Secure cloud deployment, 99.9% uptime guarantee, advanced security, and compliance with real estate industry standards.",
      link: "#features",
      icon: <Award className="h-8 w-8 text-blue-500" />
    },
    {
      title: "6 Months Premium Support",
      description: "Dedicated support team, priority bug fixes, performance optimization, training for your team, and strategic implementation guidance included in every deployment.",
      link: "#features",
      icon: <Wrench className="h-8 w-8 text-yellow-500" />
    },
  ];

  const productSteps = [
    {
      title: "Complete CRM Dashboard",
      description: "Your centralized command center. View all leads, deals, and team activities in real-time with customizable widgets, advanced reporting, and actionable insights tailored to your business.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      badge: "Dashboard",
      icon: <Layout className="h-5 w-5" />
    },
    {
      title: "Powerful Pipeline Management",
      description: "Move deals with confidence. Multi-stage pipelines, automated workflows, custom fields, bulk actions, and collaboration tools designed for real estate teams of any size.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
      badge: "CRM",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Secure Client Portal",
      description: "Professional branded experience for your clients. Document management, property viewing schedules, transaction status tracking, and secure communication - all in one place.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      badge: "Collaboration",
      icon: <Lock className="h-5 w-5" />
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
                <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-500 font-medium hover:text-primary transition-colors">Powered by Lexonit</a>
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
              Enterprise-Grade CRM: Production Ready & Fully Customizable
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60 pb-6 leading-tight max-w-4xl"
            >
              Enterprise CRM Built for <br />
              <FlipText words={words} className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent font-extrabold pb-2" />
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 font-normal text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-center mx-auto mb-10 leading-relaxed"
            >
              Deploy a powerful, fully customizable real estate CRM on your own infrastructure. Get production-ready technology with 6 months of premium support included. No subscriptions, no dependencies—full ownership and control.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-none shadow-xl shadow-black/5 dark:shadow-white/5" onClick={onLogin}>
                Get Custom Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base font-medium border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white bg-white/50 dark:bg-black/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-sm"
                onClick={() => scrollToSection('showcase')}
              >
                View Features
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
                Why Choose {companyName}?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-xl">
                A complete, enterprise-grade CRM solution with full customization, in-house deployment, and comprehensive support.
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
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">Transparent Pricing for Every Scale</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-xl">All plans include production-ready deployment and 6 months of premium support.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Solo Agent Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col shadow-lg dark:shadow-none transition-colors duration-300">
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Solo Agent</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">Custom Quote</div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">For individual agents and small teams.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Full CRM Platform</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> In-House Deployment</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> 6 Months Support</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Basic Customization</li>
                    </ul>
                    </CardContent>
                    <div className="mt-8">
                    <Button variant="outline" className="w-full rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 h-12" onClick={onLogin}>Get Quote</Button>
                    </div>
                </div>
              </BackgroundGradient>

              {/* Brokerage Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900" containerClassName="md:scale-105 z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden shadow-xl dark:shadow-none transition-colors duration-300">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
                    </div>
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Brokerage</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">Custom Quote</div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">For growing brokerages with multiple agents.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Everything in Solo</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Team Management</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Advanced Customization</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-primary mr-3" /> Priority Support</li>
                    </ul>
                    </CardContent>
                    <div className="mt-8">
                    <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white border-none h-12 font-semibold" onClick={onLogin}>Schedule Demo</Button>
                    </div>
                </div>
              </BackgroundGradient>

              {/* Enterprise Plan */}
              <BackgroundGradient className="rounded-[22px] p-1 h-full bg-white dark:bg-zinc-900">
                <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full flex flex-col shadow-lg dark:shadow-none transition-colors duration-300">
                    <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl text-neutral-800 dark:text-neutral-200">Enterprise</CardTitle>
                    <div className="text-4xl font-bold mt-4 text-neutral-900 dark:text-white">Custom Quote</div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">For large-scale operations and networks.</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Full Customization</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Unlimited Users</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> 12+ Months Support</li>
                        <li className="flex items-center"><Check className="h-5 w-5 text-neutral-900 dark:text-white mr-3" /> Dedicated Account Manager</li>
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

        {/* Benefits Section */}
        <section className="py-24 relative bg-white dark:bg-black transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">
                What You Get
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-xl">
                A complete package designed for success from day one.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">100% Customizable</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Modify workflows, fields, and features to match your exact business requirements.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Data Security</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Full control of your data on your infrastructure. HIPAA & GDPR ready deployment options.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Lightning className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Fast Implementation</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Production-ready in weeks, not months. Pre-built templates and modules included.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">6 Months Support</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Dedicated team for implementation, training, and optimization during your first 6 months.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Vendor Lock-in</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Open architecture. Export your data anytime. You own everything.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Scalable</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Grow from a solo agent to a multi-office organization without switching platforms.
                </p>
              </div>

              {/* Benefit 7 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Team Collaboration</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Real-time collaboration, task management, and communication tools built-in.
                </p>
              </div>

              {/* Benefit 8 */}
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 hover:border-primary/30 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Laptop className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Modern Interface</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Beautiful, intuitive design that your team will actually want to use daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-neutral-100 dark:bg-zinc-900/30 transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-neutral-900 dark:text-white">
                  Enterprise CRM <br/>Built Your Way.
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6 leading-relaxed">
                  We believe your CRM should work for you, not the other way around. {companyName} gives you complete control over your data, workflows, and user experience. Deploy it on your infrastructure, customize it completely, and own the entire system.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6 leading-relaxed">
                  No vendor lock-in. No subscription dependencies. No surprise price increases. Just a powerful, production-ready CRM with 6 months of dedicated support to ensure your success.
                </p>
                <div className="space-y-3 mb-10">
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Full Customization</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tailor every aspect to match your workflows</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">In-House Deployment</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Deploy on your own servers or cloud infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">6 Months Support</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Dedicated team to help you succeed</p>
                    </div>
                  </div>
                </div>
                <Button className="rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 h-12 px-8 font-semibold" onClick={onLogin}>
                  Start Your Transformation
                </Button>
              </div>
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                 <div className="relative rounded-xl overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-white/10 aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.1] opacity-50" />
                    <div className="relative z-10 text-center p-8">
                      <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Production Ready</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">Enterprise-grade platform trusted by leading brokerages</p>
                    </div>
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
                    <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-500 font-medium hover:text-primary transition-colors">Powered by Lexonit</a>
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
                <li><a href="https://lexonit.com/roadmap" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white text-lg">Company</h3>
              <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary dark:hover:text-white transition-colors">About Us</button></li>
                <li><a href="https://lexonit.com/careers" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="https://lexonit.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white text-lg">Connect</h3>
              <div className="flex space-x-4">
                 <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary dark:hover:text-white transition-colors">
                    <Globe className="h-6 w-6" />
                 </a>
                 <a href="https://twitter.com/lexonit" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary dark:hover:text-white transition-colors">
                    <Twitter className="h-6 w-6" />
                 </a>
                 <a href="https://linkedin.com/company/lexonit" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary dark:hover:text-white transition-colors">
                    <Linkedin className="h-6 w-6" />
                 </a>
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
