
import React from 'react';
import { Clock, Globe, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">GPODO</h3>
                <p className="text-sm text-gray-400">Smart B2B Platform</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering businesses worldwide through intelligent collaboration, 
              smart contracting, and strategic partnerships.
            </p>
            <div className="flex gap-2">
              <Select defaultValue="en">
                <SelectTrigger className="w-20 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="ar">🇸🇦 AR</SelectItem>
                  <SelectItem value="fr">🇫🇷 FR</SelectItem>
                  <SelectItem value="zh">🇨🇳 ZH</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="us">
                <SelectTrigger className="w-20 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">🇺🇸 US</SelectItem>
                  <SelectItem value="uk">🇬🇧 UK</SelectItem>
                  <SelectItem value="ca">🇨🇦 CA</SelectItem>
                  <SelectItem value="au">🇦🇺 AU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#collaborative-purchasing" className="hover:text-white transition-colors flex items-center gap-1">Collaborative Purchasing <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#marketing" className="hover:text-white transition-colors flex items-center gap-1">Marketing Alliance <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#suppliers" className="hover:text-white transition-colors flex items-center gap-1">Supplier Network <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#freelancers" className="hover:text-white transition-colors flex items-center gap-1">Freelancer Hub <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#formation" className="hover:text-white transition-colors flex items-center gap-1">Company Formation <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#legal" className="hover:text-white transition-colors flex items-center gap-1">Legal Services <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support Center</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#help" className="hover:text-white transition-colors">Help & Support</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#tutorials" className="hover:text-white transition-colors">Video Tutorials</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#status" className="hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@gpodo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>24/7 Global Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 GPODO. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
