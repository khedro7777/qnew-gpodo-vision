
import React from 'react';
import { ArrowRight, Users, Shield, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ModernHeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      // Trigger auth modal or navigate to signup
      navigate('/dashboard');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Global Platform for Business Collaboration</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          <span className="block text-gray-900 mb-2">GPO SMART</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Business Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Transform your business collaboration with our unified platform. 
          Join specialized gateways, form powerful groups, and leverage collective negotiation power.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-medium">10,000+ Active Members</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Shield className="w-6 h-6 text-purple-600" />
            <span className="font-medium">Enterprise Security</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Globe className="w-6 h-6 text-pink-600" />
            <span className="font-medium">Global Coverage</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
