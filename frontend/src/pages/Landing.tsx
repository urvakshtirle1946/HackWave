import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Brain, 
  TrendingUp, 
  Database, 
  Zap, 
  CheckCircle, 
  Users, 
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Target,
  ArrowUpRight,
  Play,
  Clock,
  Eye
} from 'lucide-react';

// Navigation Header Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold text-white">SupplyChain AI</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
          <a href="#team" className="hover:text-white transition-colors">Team</a>
        </nav>
        
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/signup" className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">Sign in</Link>
          <Link to="/app/vulnerability-assessment" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90">Launch App</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="flex flex-col space-y-4 p-6">
            <a href="#features" className="text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#workflow" className="text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#team" className="text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Team</a>
            <Link to="/signup" className="bg-white text-black px-4 py-2 rounded-full text-center font-medium hover:bg-white/90 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

// Hero Section Component
const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes subtlePulse {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.03);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>

      <section className="relative isolate h-screen overflow-hidden bg-black text-white">
        {/* ================== BACKGROUND ================== */}
        {/* Luminous elliptical gradients */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              // Main central dome/band (slightly below center)
              "radial-gradient(80% 55% at 50% 52%, rgba(59,130,246,0.45) 0%, rgba(37,99,235,0.46) 27%, rgba(30,64,175,0.38) 47%, rgba(30,58,138,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
              // Warm sweep from top-left
              "radial-gradient(85% 60% at 14% 0%, rgba(147,197,253,0.65) 0%, rgba(96,165,250,0.58) 30%, rgba(48,24,28,0.0) 64%)",
              // Cool rim on top-right
              "radial-gradient(70% 50% at 86% 22%, rgba(59,130,246,0.40) 0%, rgba(16,18,28,0.0) 55%)",
              // Soft top vignette
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />

        {/* Vignette corners for extra contrast */}
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />

        {/* Grid overlay: vertical columns + subtle curved horizontal arcs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-30"
          style={{
            backgroundImage: [
              // Vertical grid lines (major & minor)
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
              // Curved horizontal arcs via repeating elliptical radial gradient
              "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.08) 0 1px, transparent 1px 120px)"
            ].join(","),
            backgroundBlendMode: "screen",
          }}
        />

        <Navigation />

        {/* ================== COPY ================== */}
        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
          <div className={`mx-auto text-center ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              AI-Powered Risk Management
            </span>
            
            <h1 style={{ animationDelay: '200ms' }} className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <span className="text-blue-400">AI-Powered</span> Supply Chain
              <br />
              <span className="text-blue-300">Resilience</span>
            </h1>
            
            <p style={{ animationDelay: '300ms' }} className={`mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              Analyze. Predict. Mitigate Risks Before They Happen.
            </p>
            
            <div style={{ animationDelay: '400ms' }} className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <Link to="/app/vulnerability-assessment" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90 group">
                <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Run a Live Simulation
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* ================== PARTNERS ================== */}
        <div className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-24">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {["SAP", "Oracle", "Microsoft", "AWS", "Google Cloud", "IBM", "Salesforce", "Workday"].map((brand) => (
              <div key={brand} className="text-xs uppercase tracking-wider text-white/70">{brand}</div>
            ))}
          </div>
        </div>

        {/* ================== FOREGROUND ================== */}
        {/* Center-bottom rectangular glow with pulse animation */}
        <div
          className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md bg-gradient-to-b from-blue-400/75 via-blue-300/60 to-transparent"
          style={{ animation: 'subtlePulse 6s ease-in-out infinite' }}
        />

        {/* Stepped pillars silhouette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
          {/* dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          {/* bars */}
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
            {[92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-black transition-height duration-1000 ease-in-out"
                style={{
                  height: isMounted ? `${h}%` : '0%',
                  transitionDelay: `${Math.abs(i - 8) * 60}ms`
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Problem Section Component
const Problem = () => (
  <section className="py-20 bg-black/50 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Why Supply Chain Risk is a Critical Challenge
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Unpredictable Disruptions</h3>
          <p className="text-white/70">Natural disasters, geopolitical tensions, and pandemics can cripple supply chains overnight, causing massive financial losses.</p>
        </div>
        
        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Complex Interdependencies</h3>
          <p className="text-white/70">Modern supply chains span multiple countries and suppliers, making risk assessment and mitigation extremely complex.</p>
        </div>
        
        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Reactive Responses</h3>
          <p className="text-white/70">Most companies only react after disruptions occur, leading to higher costs and longer recovery times.</p>
        </div>
      </div>
    </div>
  </section>
);

// Solution Section Component
const Solution = () => (
  <section className="py-20 bg-gradient-to-br from-black via-slate-900/50 to-black">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Meet Our AI Agent System
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Think of it as your 24/7 risk analyst, optimizer, and decision advisor.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Intelligent Risk Detection</h3>
          <p className="text-white/70">Advanced ML algorithms continuously monitor your supply chain for potential risks and anomalies.</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Predictive Analytics</h3>
          <p className="text-white/70">Forecast potential disruptions weeks or months in advance using historical data and external factors.</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Real-time Monitoring</h3>
          <p className="text-white/70">24/7 surveillance of your entire supply network with instant alerts and notifications.</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Scenario Simulation</h3>
          <p className="text-white/70">Run thousands of "what-if" scenarios to test your resilience and optimize your response strategies.</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Automated Mitigation</h3>
          <p className="text-white/70">AI-powered recommendations and automated actions to minimize impact when disruptions occur.</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Data Integration</h3>
          <p className="text-white/70">Seamlessly connect with your existing ERP, SCM, and logistics systems for comprehensive insights.</p>
        </div>
      </div>
    </div>
  </section>
);

// Workflow Section Component
const Workflow = () => (
  <section id="workflow" className="py-20 bg-black/30 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          How It Works
        </h2>
      </div>
      
      <div className="relative">
        {/* Connection lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform -translate-y-1/2"></div>
        
        <div className="grid lg:grid-cols-5 gap-8 relative z-10">
          {[
            { icon: Database, title: "Ingest Data", desc: "Connect all your supply chain data sources" },
            { icon: Brain, title: "Detect Anomalies", desc: "AI identifies potential risks and patterns" },
            { icon: BarChart3, title: "Simulate Scenarios", desc: "Run thousands of what-if simulations" },
            { icon: Lightbulb, title: "Suggest Mitigations", desc: "Get AI-powered recommendations" },
            { icon: CheckCircle, title: "Human Approves", desc: "Review and approve final decisions" }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Features & Benefits Section Component
const Features = () => (
  <section id="features" className="py-20 bg-gradient-to-br from-black via-slate-900/30 to-black">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Features & Benefits
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Eye className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">End-to-End Visibility</h3>
          <p className="text-white/70 text-lg">Get complete transparency across your entire supply chain, from raw materials to final delivery, with real-time tracking and monitoring.</p>
        </div>
        
        <div className="bg-white/5 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Data-Driven Decisions</h3>
          <p className="text-white/70 text-lg">Make informed decisions based on comprehensive analytics, predictive insights, and AI-powered recommendations.</p>
        </div>
        
        <div className="bg-white/5 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Proactive Risk Management</h3>
          <p className="text-white/70 text-lg">Identify and address potential risks before they become problems, with automated alerts and mitigation strategies.</p>
        </div>
        
        <div className="bg-white/5 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 backdrop-blur">
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Integrated with Ops</h3>
          <p className="text-white/70 text-lg">Seamlessly integrate with your existing operational systems for a unified view and streamlined workflows.</p>
        </div>
      </div>
    </div>
  </section>
);

// Dashboard Sneak Peek Section Component
const SneakPeek = () => (
  <section className="py-20 bg-black/50 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Dashboard Sneak Peek
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          See how our AI-powered dashboard transforms complex supply chain data into actionable insights.
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 md:p-12 text-center border border-white/10 backdrop-blur">
        <div className="w-full max-w-4xl mx-auto bg-black/50 rounded-2xl shadow-2xl p-8 mb-8 border border-white/10">
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-white/70 text-lg">Interactive Dashboard Preview</p>
              <p className="text-white/50 text-sm">Real-time supply chain analytics and risk visualization</p>
            </div>
          </div>
        </div>
        
        <Link to="/app/vulnerability-assessment" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-black shadow transition hover:bg-white/90 group">
          Explore Dashboard
          <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

// Team Section Component
const Team = () => (
  <section id="team" className="py-20 bg-gradient-to-br from-black via-slate-900/30 to-black">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Meet Our Team
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Passionate engineers and data scientists building the future of supply chain resilience.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: "Alex Chen", role: "Lead AI Engineer", avatar: "👨‍💻" },
          { name: "Sarah Kim", role: "Data Scientist", avatar: "👩‍🔬" },
          { name: "Marcus Rodriguez", role: "Supply Chain Expert", avatar: "👨‍💼" },
          { name: "Priya Patel", role: "Full-Stack Developer", avatar: "👩‍💻" }
        ].map((member, index) => (
          <div key={index} className="text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              {member.avatar}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
            <p className="text-white/70">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Scroll to Top Button Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUpRight className="w-6 h-6 rotate-45" />
        </button>
      )}
    </>
  );
};

// Final CTA Section Component
const FinalCTA = () => (
  <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Supply chains are fragile. Let's make them future-proof with AI.
      </h2>
      <p className="text-xl mb-8 text-blue-100">
        Join the revolution in supply chain resilience. Experience the power of AI-driven risk management.
      </p>
              <Link to="/app/vulnerability-assessment" className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
        Explore Full Dashboard
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

// Main Landing Page Component
const Landing = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <Problem />
      <Solution />
      <Workflow />
      <Features />
      <SneakPeek />
      <Team />
      <FinalCTA />
      <ScrollToTop />
    </div>
  );
};

export default Landing;
