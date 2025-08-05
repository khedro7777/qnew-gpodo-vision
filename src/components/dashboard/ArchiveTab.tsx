
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, FileText, Download, Eye } from 'lucide-react';

const ArchiveTab = () => {
  const archivedRecords = [
    {
      id: '1',
      title: 'Tech Supplies Purchase Agreement',
      type: 'SPA',
      group: 'Tech Supplies Group',
      date: '2025-07-30',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Manufacturing LOI Document',
      type: 'LOI',
      group: 'Manufacturing Group',
      date: '2025-07-28',
      size: '1.2 MB'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-gray-600 to-gray-800 text-white">
        <div className="flex items-center gap-4">
          <Archive className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Document Archive</h2>
            <p className="text-white/80">All records & PDFs stored securely</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Archived Documents</h3>
        <div className="space-y-3">
          {archivedRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-400" />
                <div>
                  <h4 className="font-semibold text-gray-900">{record.title}</h4>
                  <p className="text-sm text-gray-600">{record.group} • {record.date} • {record.size}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ArchiveTab;
