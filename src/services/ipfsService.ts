
import { create as createIPFS, IPFSHTTPClient } from 'ipfs-http-client';

interface IPFSDocument {
  cid: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  signature?: string;
  tags?: string[];
  description?: string;
}

interface IPFSUploadResult {
  cid: string;
  path: string;
  size: number;
}

interface IPFSMetadata {
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  didKey: string;
  groupId: string | null;
  tags?: string[];
  description?: string;
}

class IPFSService {
  private client: IPFSHTTPClient;
  private didKey: string;
  private fileStorage: Map<string, IPFSDocument[]> = new Map();

  constructor() {
    // Initialize IPFS client (using public IPFS node for demo)
    this.client = createIPFS({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: 'Basic ' + btoa('your-project-id:your-project-secret')
      }
    });
    
    this.didKey = 'did:key:z6Mkq6THPd7eczYjwWU62wmLWpiAPejWHvnj9BT9yi3RK4sS';
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some demo data for better UX
    const defaultGroupFiles: IPFSDocument[] = [
      {
        cid: 'QmXjkFQjnj8VgZ2X5q9mP3nW8kR7tL4sE2dF6gH9iJ1kL2',
        name: 'business_proposal.pdf',
        size: 1024000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: this.didKey,
        tags: ['business', 'proposal'],
        description: 'Comprehensive business proposal document'
      },
      {
        cid: 'QmYkjFRjoj9VhA3Y6r0nQ4oX9lS8uM5fG3eH7iK0jM2nO3',
        name: 'team_presentation.pptx',
        size: 2048000,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        uploadedBy: this.didKey,
        tags: ['presentation', 'team'],
        description: 'Team introduction and project overview'
      },
      {
        cid: 'QmZljGSjpk0ViB4Z7s1oR5pY0mT9vN6gH4fI8jL1kM3nP4',
        name: 'contract_draft.docx',
        size: 512000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        uploadedBy: this.didKey,
        tags: ['legal', 'contract'],
        description: 'Initial contract draft for review'
      }
    ];

    this.fileStorage.set('default', defaultGroupFiles);
  }

  async uploadFile(file: File, groupId?: string, metadata?: Partial<IPFSMetadata>): Promise<IPFSUploadResult> {
    try {
      console.log('Uploading file to IPFS:', file.name);
      
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Create comprehensive metadata
      const fileMetadata: IPFSMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        didKey: this.didKey,
        groupId: groupId || 'default',
        tags: metadata?.tags || [],
        description: metadata?.description || ''
      };

      // Simulate IPFS upload (in real implementation, this would upload to actual IPFS)
      const mockCid = this.generateMockCID();
      
      // Store in local cache for demo purposes
      const groupKey = groupId || 'default';
      const existingFiles = this.fileStorage.get(groupKey) || [];
      
      const newFile: IPFSDocument = {
        cid: mockCid,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: fileMetadata.uploadedAt,
        uploadedBy: this.didKey,
        tags: fileMetadata.tags,
        description: fileMetadata.description
      };

      existingFiles.unshift(newFile);
      this.fileStorage.set(groupKey, existingFiles);

      console.log('File uploaded to IPFS:', mockCid);

      return {
        cid: mockCid,
        path: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateMockCID(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'Qm';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async retrieveFile(cid: string): Promise<Uint8Array> {
    try {
      console.log('Retrieving file from IPFS:', cid);
      
      // In a real implementation, this would retrieve from IPFS
      // For demo, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return mock file data
      const mockData = new Uint8Array([80, 68, 70]); // PDF header bytes
      return mockData;
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw new Error(`Failed to retrieve from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFileUrl(cid: string): Promise<string> {
    // Return IPFS gateway URL for file access
    return `https://ipfs.io/ipfs/${cid}`;
  }

  async listGroupFiles(groupId: string): Promise<IPFSDocument[]> {
    console.log('Listing files for group:', groupId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.fileStorage.get(groupId) || [];
  }

  async pinFile(cid: string): Promise<void> {
    try {
      console.log('Pinning file to IPFS:', cid);
      
      // Simulate pinning process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('File pinned to IPFS:', cid);
    } catch (error) {
      console.error('IPFS pinning error:', error);
      throw new Error(`Failed to pin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unpinFile(cid: string): Promise<void> {
    try {
      console.log('Unpinning file from IPFS:', cid);
      
      // Simulate unpinning process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('File unpinned from IPFS:', cid);
    } catch (error) {
      console.error('IPFS unpinning error:', error);
      throw new Error(`Failed to unpin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(cid: string, groupId: string): Promise<boolean> {
    try {
      console.log('Deleting file from IPFS:', cid);
      
      const groupFiles = this.fileStorage.get(groupId) || [];
      const updatedFiles = groupFiles.filter(file => file.cid !== cid);
      this.fileStorage.set(groupId, updatedFiles);
      
      console.log('File deleted from IPFS:', cid);
      return true;
    } catch (error) {
      console.error('IPFS deletion error:', error);
      return false;
    }
  }

  async addFileTags(cid: string, groupId: string, tags: string[]): Promise<boolean> {
    try {
      const groupFiles = this.fileStorage.get(groupId) || [];
      const fileIndex = groupFiles.findIndex(file => file.cid === cid);
      
      if (fileIndex !== -1) {
        groupFiles[fileIndex].tags = [...(groupFiles[fileIndex].tags || []), ...tags];
        this.fileStorage.set(groupId, groupFiles);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding tags:', error);
      return false;
    }
  }

  async searchFiles(groupId: string, query: string): Promise<IPFSDocument[]> {
    const files = await this.listGroupFiles(groupId);
    const searchTerm = query.toLowerCase();
    
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm) ||
      file.description?.toLowerCase().includes(searchTerm) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  getDIDKey(): string {
    return this.didKey;
  }

  verifyDIDKey(providedKey: string): boolean {
    return providedKey === this.didKey;
  }

  getStorageStats(groupId: string): { totalFiles: number; totalSize: number; types: Record<string, number> } {
    const files = this.fileStorage.get(groupId) || [];
    const types: Record<string, number> = {};
    
    files.forEach(file => {
      const mainType = file.type.split('/')[0];
      types[mainType] = (types[mainType] || 0) + 1;
    });

    return {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      types
    };
  }
}

export const ipfsService = new IPFSService();
export type { IPFSDocument, IPFSUploadResult, IPFSMetadata };
