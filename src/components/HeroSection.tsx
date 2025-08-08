import React, { useState } from 'react';
import { Search, ArrowRight, Users, Building, Briefcase, ShieldCheck, Globe, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useCountries, useIndustrySectors } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
  const [searchFilters, setSearchFilters] = useState({
    gateway: '',
    sector: '',
    country: ''
  });

  const { data: countries } = useCountries();
  const { data: sectors } = useIndustrySectors();
  const { user } = useAuth();

  const handleSearch = () => {
    console.log('Search filters:', searchFilters);
    // TODO: Implement search functionality
  };

  const portalGateways = [
    { value: 'purchasing', label: 'Cooperative Purchasing', icon: '🛒' },
    { value: 'marketing', label: 'Cooperative Marketing', icon: '📈' },
    { value: 'formation', label: 'Company Formation', icon: '🏢' },
    { value: 'investment', label: 'Investment Groups', icon: '💰' },
    { value: 'suppliers', label: 'Suppliers', icon: '🏭' },
    { value: 'freelancers', label: 'Freelancers', icon: '👨‍💻' },
    { value: 'teams', label: 'Freelancer Teams', icon: '👥' },
    { value: 'services', label: 'Service Providers', icon: '🛠️' },
    { value: 'products', label: 'Product Listings', icon: '📦' },
    { value: 'arbitration', label: 'Arbitration & Documentation', icon: '⚖️' },
    { value: 'requests', label: 'Arbitration Requests', icon: '📋' },
    { value: 'negotiation', label: 'Smart Negotiation Tools', icon: '🤝' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              🌍 International Commercial Law Compliant
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            GPO SMART Platform
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Smart B2B Collaboration
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Introducing the future of business collaboration to the industrial world. 
            A unified platform with smart enhancements for collective procurement, 
            fair negotiation, and transparent contract management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              {user ? 'Create Your Group' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          {/* Founders Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-12">
            <p className="text-sm text-gray-600 mb-2">Founded by</p>
            <p className="font-semibold text-gray-900 text-lg">Mohamed Hassanein & Ahmed Seddiq</p>
            <p className="text-gray-600 italic mt-2">
              "Transforming negotiation from a privilege into a professional, participatory process — accessible to all"
            </p>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Collaboration Features</h3>
            <p className="text-gray-600">Built on international standards and AI-powered intelligence</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Collective Empowerment</h4>
              <p className="text-sm text-gray-600">Form groups, vote on decisions, and negotiate collectively with transparent governance</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Legal Compliance</h4>
              <p className="text-sm text-gray-600">UNCITRAL & ICC standards with built-in arbitration and smart contracts</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <Globe className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
              <p className="text-sm text-gray-600">Multi-language, multi-currency platform connecting businesses worldwide</p>
            </div>
          </div>
        </div>

        {/* Smart Gateway Selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Gateway</h3>
            <p className="text-gray-600">Choose from 12 specialized portals designed for different business needs</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Select value={searchFilters.gateway} onValueChange={(value) => setSearchFilters({...searchFilters, gateway: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gateway" />
              </SelectTrigger>
              <SelectContent>
                {portalGateways.map((portal) => (
                  <SelectItem key={portal.value} value={portal.value}>
                    {portal.icon} {portal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={searchFilters.sector} onValueChange={(value) => setSearchFilters({...searchFilters, sector: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Industry Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.icon} {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={searchFilters.country} onValueChange={(value) => setSearchFilters({...searchFilters, country: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Explore Groups
            </Button>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Handshake className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Smart Group Creation</span>
            </div>
            <p className="text-gray-700">
              Can't find a suitable group? Our AI will help you create one and invite relevant members from our global network!
            </p>
          </div>
        </div>

        {/* Reference Standards */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Built on International Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
            <span>UNCITRAL Compliance</span>
            <span>•</span>
            <span>ICC Commercial Law</span>
            <span>•</span>
            <span>ISO 44001 Standards</span>
            <span>•</span>
            <span>Smart Governance (DAO)</span>
            <span>•</span>
            <span>MCP AI Integration</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
