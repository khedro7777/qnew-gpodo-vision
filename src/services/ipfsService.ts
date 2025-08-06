
import { create as createIPFS, IPFSHTTPClient } from 'ipfs-http-client';
import { decode as base58Decode } from '@stablelib/base58';

interface IPFSDocument {
  cid: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  signature?: string;
}

interface IPFSUploadResult {
  cid: string;
  path: string;
  size: number;
}

class IPFSService {
  private client: IPFSHTTPClient;
  private didKey: string;

  constructor() {
    // Initialize IPFS client (using Infura's IPFS gateway)
    this.client = createIPFS({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: 'Bearer ' + btoa('your-project-id:your-project-secret')
      }
    });
    
    this.didKey = 'did:key:z6Mkq6THPd7eczYjwWU62wmLWpiAPejWHvnj9BT9yi3RK4sS';
  }

  async uploadFile(file: File, groupId?: string): Promise<IPFSUploadResult> {
    try {
      console.log('Uploading file to IPFS:', file.name);
      
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Create metadata
      const metadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        didKey: this.didKey,
        groupId: groupId || null
      };

      // Upload file with metadata
      const result = await this.client.add({
        path: file.name,
        content: uint8Array
      }, {
        pin: true,
        wrapWithDirectory: false
      });

      // Upload metadata separately
      const metadataResult = await this.client.add({
        path: `${file.name}.metadata.json`,
        content: JSON.stringify(metadata)
      });

      console.log('File uploaded to IPFS:', result.cid.toString());

      return {
        cid: result.cid.toString(),
        path: result.path,
        size: result.size
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async retrieveFile(cid: string): Promise<Uint8Array> {
    try {
      console.log('Retrieving file from IPFS:', cid);
      
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
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
    // In a real implementation, you would store file metadata in a database
    // For now, return mock data
    return [
      {
        cid: 'QmExample1',
        name: 'letter_of_intent.pdf',
        size: 1024000,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadedBy: this.didKey
      },
      {
        cid: 'QmExample2',
        name: 'icpo_document.pdf',
        size: 2048000,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadedBy: this.didKey
      }
    ];
  }

  async pinFile(cid: string): Promise<void> {
    try {
      await this.client.pin.add(cid);
      console.log('File pinned to IPFS:', cid);
    } catch (error) {
      console.error('IPFS pinning error:', error);
      throw new Error(`Failed to pin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unpinFile(cid: string): Promise<void> {
    try {
      await this.client.pin.rm(cid);
      console.log('File unpinned from IPFS:', cid);
    } catch (error) {
      console.error('IPFS unpinning error:', error);
      throw new Error(`Failed to unpin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getDIDKey(): string {
    return this.didKey;
  }

  verifyDIDKey(providedKey: string): boolean {
    return providedKey === this.didKey;
  }
}

export const ipfsService = new IPFSService();
export type { IPFSDocument, IPFSUploadResult };
