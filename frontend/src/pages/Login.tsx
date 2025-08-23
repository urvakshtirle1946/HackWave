import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
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
  Clock
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    try {
      // Add your actual login logic here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        navigate('/app');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SupplyChain AI</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-white/70">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

                         <div>
               <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                 Email address
               </label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-white/50" />
                 </div>
                 <input
                   id="email"
                   name="email"
                   type="email"
                   autoComplete="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur"
                   placeholder="Enter your email"
                 />
               </div>
             </div>

                         <div>
               <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                 Password
               </label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-white/50" />
                 </div>
                 <input
                   id="password"
                   name="password"
                   type={showPassword ? 'text' : 'password'}
                   autoComplete="current-password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur"
                   placeholder="Enter your password"
                 />
                 <button
                   type="button"
                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? (
                     <EyeOff className="h-5 w-5 text-white/50 hover:text-white/70" />
                   ) : (
                     <Eye className="h-5 w-5 text-white/50 hover:text-white/70" />
                   )}
                 </button>
               </div>
             </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                                 <input
                   id="remember-me"
                   name="remember-me"
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/5"
                 />
                 <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                   Remember me
                 </label>
               </div>
               <div className="text-sm">
                 <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                   Forgot password?
                 </a>
               </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

                     {/* Sign up link */}
           <div className="mt-8 text-center">
             <p className="text-white/70">
               Don't have an account?{' '}
               <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                 Sign up for free
               </Link>
             </p>
           </div>

           {/* Demo credentials */}
           <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur">
             <p className="text-sm text-white/70 mb-2">Demo credentials:</p>
             <p className="text-xs text-white/50">Email: demo@supplychain.ai</p>
             <p className="text-xs text-white/50">Password: any password</p>
           </div>
        </div>
      </div>

             {/* Right Side - Feature Preview */}
       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-slate-900/50 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1920' height='1080' fill='%230f172a'/%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%231e293b' stroke-width='1' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grid)'/%3E%3Cg opacity='0.1'%3E%3Ccircle cx='300' cy='200' r='150' fill='%233b82f6'/%3E%3Ccircle cx='1600' cy='800' r='200' fill='%233b82f6'/%3E%3Ccircle cx='1200' cy='300' r='100' fill='%233b82f6'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              AI-Powered Supply Chain
              <br />
              <span className="text-blue-400">Risk Management</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Analyze, predict, and mitigate supply chain risks before they happen with our intelligent AI platform.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Brain, text: "Intelligent risk detection with ML algorithms" },
                { icon: TrendingUp, text: "Predictive analytics and forecasting" },
                { icon: Shield, text: "Real-time monitoring and alerts" },
                { icon: Target, text: "Scenario simulation and optimization" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 right-20 opacity-20 animate-pulse">
                <Database className="w-12 h-12 text-blue-400" />
              </div>
              <div className="absolute bottom-20 left-20 opacity-20 animate-pulse" style={{animationDelay: '1s'}}>
                <BarChart3 className="w-10 h-10 text-blue-300" />
              </div>
              <div className="absolute top-1/2 right-10 opacity-20 animate-pulse" style={{animationDelay: '2s'}}>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
