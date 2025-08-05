
import React, { useState } from 'react';
import { Search, ArrowRight, Users, Building, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const HeroSection = () => {
  const [searchFilters, setSearchFilters] = useState({
    gateway: '',
    sector: '',
    country: ''
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Collaborative Intelligence for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-productivity-blue to-productivity-purple">
              Smarter B2B Contracting
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect, collaborate, and succeed with our intelligent platform designed 
            for modern B2B partnerships and contracting solutions.
          </p>

          <Button size="lg" className="mb-12 bg-productivity-blue hover:bg-productivity-blue/90 text-lg px-8 py-6">
            Start Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* AI Simulation Box */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Group Creation</h3>
            <p className="text-gray-600">Watch how our intelligent system helps create and manage B2B groups</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
              <Users className="w-8 h-8 text-productivity-blue mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Smart Matching</h4>
              <p className="text-sm text-gray-600">AI matches companies with similar needs and goals</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl">
              <Building className="w-8 h-8 text-productivity-purple mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Industry Focus</h4>
              <p className="text-sm text-gray-600">Specialized groups for every sector and business type</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <Briefcase className="w-8 h-8 text-productivity-green mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Automated Setup</h4>
              <p className="text-sm text-gray-600">We handle invitations, setup, and initial coordination</p>
            </div>
          </div>
        </div>

        {/* Smart Search Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Group</h3>
            <p className="text-gray-600">Use our smart filters to discover relevant B2B collaboration opportunities</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Select value={searchFilters.gateway} onValueChange={(value) => setSearchFilters({...searchFilters, gateway: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Type of Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchasing">Collaborative Purchasing</SelectItem>
                <SelectItem value="marketing">Collaborative Marketing</SelectItem>
                <SelectItem value="suppliers">Supplier Offers</SelectItem>
                <SelectItem value="freelancers">Freelancers</SelectItem>
                <SelectItem value="formation">Company Formation</SelectItem>
                <SelectItem value="legal">Legal & Arbitration</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchFilters.sector} onValueChange={(value) => setSearchFilters({...searchFilters, sector: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Industry Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchFilters.country} onValueChange={(value) => setSearchFilters({...searchFilters, country: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
              <Search className="w-4 h-4 mr-2" />
              Search Groups
            </Button>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-productivity-green/10 to-productivity-blue/10 rounded-xl">
            <p className="text-productivity-green font-medium">
              💡 Can't find a group in your industry? 
              <strong> We'll help you create one and invite relevant members!</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
