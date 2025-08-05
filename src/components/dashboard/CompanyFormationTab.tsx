
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, FileCheck, UserCheck, Calendar } from 'lucide-react';

const CompanyFormationTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-violet-500 to-indigo-600 text-white">
        <div className="flex items-center gap-4">
          <Building2 className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Company Formation</h2>
            <p className="text-white/80">Legal setup and advisor onboarding</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <FileCheck className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Documentation</h3>
          <p className="text-gray-600 text-sm mb-4">Complete legal paperwork and registration</p>
          <Button className="w-full">Start Process</Button>
        </Card>

        <Card className="p-6 text-center">
          <UserCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advisor Onboarding</h3>
          <p className="text-gray-600 text-sm mb-4">Connect with legal and business advisors</p>
          <Button className="w-full">Find Advisors</Button>
        </Card>

        <Card className="p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
          <p className="text-gray-600 text-sm mb-4">Schedule consultation with experts</p>
          <Button className="w-full">Book Meeting</Button>
        </Card>
      </div>
    </div>
  );
};

export default CompanyFormationTab;
