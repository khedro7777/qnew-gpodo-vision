
import React from 'react';
import IPFSFileManager from '@/components/ipfs/IPFSFileManager';

const IPFSTab = () => {
  return (
    <div className="space-y-6">
      <IPFSFileManager groupId="default" />
    </div>
  );
};

export default IPFSTab;
