
import React from 'react';
import { 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Brain, 
  Lock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols protect your business data and transactions.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Intelligent algorithms connect you with the most relevant business partners and opportunities.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with businesses worldwide through our international compliance framework.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'Automate negotiations, contract management, and payment processing seamlessly.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Collaborative Governance',
      description: 'Democratic decision-making tools ensure fair and transparent group management.',
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: Lock,
      title: 'Legal Compliance',
      description: 'Built-in UNCITRAL and ICC standards ensure all agreements are legally sound.',
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  const benefits = [
    'Reduce procurement costs by up to 40%',
    'Access exclusive supplier networks',
    'Streamlined legal and contract management',
    'Real-time collaboration tools',
    'Transparent dispute resolution',
    'Multi-currency and multi-language support'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Features */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Built for Modern Business Collaboration
            </h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-6 h-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              What You'll Achieve
            </h3>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">Average Results</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">40%</div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">60%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">10x</div>
                    <div className="text-sm text-gray-600">Network Growth</div>
                  </div>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
