import { KnowledgeChunk } from '@/types/knowledgeBase';

/**
 * Runtime knowledge base loader that uses pre-processed chunks with caching
 */
export class PreprocessedKnowledgeLoader {
  private static instance: PreprocessedKnowledgeLoader;
  private chunks: KnowledgeChunk[] | null = null;
  private metadata: any = null;
  private isLoaded = false;
  private loadPromise: Promise<KnowledgeChunk[]> | null = null;

  static getInstance(): PreprocessedKnowledgeLoader {
    if (!PreprocessedKnowledgeLoader.instance) {
      PreprocessedKnowledgeLoader.instance = new PreprocessedKnowledgeLoader();
    }
    return PreprocessedKnowledgeLoader.instance;
  }

  /**
   * Load preprocessed knowledge chunks from static JSON with caching
   */
  async loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
    // Return cached data if already loaded
    if (this.isLoaded && this.chunks) {
      return this.chunks;
    }

    // Return existing promise if load is in progress
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Start the loading process
    this.loadPromise = this._loadKnowledgeBase();
    return this.loadPromise;
  }

  private async _loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
    try {
      console.log('📂 Loading preprocessed knowledge base...');
      
      // Check browser cache first
      if (typeof window !== 'undefined') {
        const cachedChunks = this.loadFromBrowserCache();
        if (cachedChunks) {
          console.log('🎯 Using browser cached knowledge base');
          this.chunks = cachedChunks;
          this.isLoaded = true;
          return cachedChunks;
        }
      }
      
      // In production, load from static files with fetch caching
      if (process.env.NODE_ENV === 'production') {
        const chunksResponse = await fetch('/knowledge-chunks.json', {
          cache: 'force-cache', // Leverage browser cache
          headers: {
            'Cache-Control': 'max-age=86400' // 24 hours
          }
        });
        
        const metadataResponse = await fetch('/knowledge-metadata.json', {
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=86400'
          }
        });
        
        if (!chunksResponse.ok) {
          throw new Error('Failed to load knowledge chunks');
        }
        
        this.chunks = await chunksResponse.json();
        this.metadata = metadataResponse.ok ? await metadataResponse.json() : null;
        
        // Cache in browser storage
        if (this.chunks) {
          this.saveToBrowserCache(this.chunks, this.metadata);
        }
        
      } else {
        // In development, try to load from file system or use fallback
        const fs = await import('fs');
        const path = await import('path');
        
        const chunksPath = path.join(process.cwd(), 'public', 'knowledge-chunks.json');
        const metadataPath = path.join(process.cwd(), 'public', 'knowledge-metadata.json');
        
        if (fs.existsSync(chunksPath)) {
          this.chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
          this.metadata = fs.existsSync(metadataPath) 
            ? JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
            : null;
        } else {
          console.warn('⚠️ Preprocessed knowledge not found, run: npm run build:knowledge');
          return [];
        }
      }
      
      this.isLoaded = true;
      console.log(`✅ Loaded ${this.chunks?.length || 0} knowledge chunks`);
      
      return this.chunks || [];
      
    } catch (error) {
      console.error('❌ Failed to load preprocessed knowledge:', error);
      this.loadPromise = null; // Allow retry
      return [];
    }
  }

  /**
   * Cache knowledge base in browser localStorage
   */
  private saveToBrowserCache(chunks: KnowledgeChunk[], metadata: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        chunks,
        metadata,
        timestamp: Date.now(),
        version: metadata?.version || '1.0.0'
      };
      
      localStorage.setItem('dr-clevens-knowledge-cache', JSON.stringify(cacheData));
      console.log('💾 Knowledge base cached in browser storage');
    } catch (error) {
      console.warn('⚠️ Failed to cache knowledge base:', error);
    }
  }

  /**
   * Load knowledge base from browser localStorage
   */
  private loadFromBrowserCache(): KnowledgeChunk[] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem('dr-clevens-knowledge-cache');
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      const ageInHours = (Date.now() - cacheData.timestamp) / (1000 * 60 * 60);
      
      // Cache expires after 24 hours
      if (ageInHours > 24) {
        localStorage.removeItem('dr-clevens-knowledge-cache');
        return null;
      }
      
      this.metadata = cacheData.metadata;
      return cacheData.chunks;
      
    } catch (error) {
      console.warn('⚠️ Failed to load from browser cache:', error);
      localStorage.removeItem('dr-clevens-knowledge-cache');
      return null;
    }
  }

  /**
   * Clear browser cache (useful for updates)
   */
  clearBrowserCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('dr-clevens-knowledge-cache');
    console.log('🗑️ Browser cache cleared');
  }

  /**
   * Get metadata about the knowledge base
   */
  getMetadata() {
    return this.metadata;
  }

  /**
   * Check if knowledge base is loaded
   */
  isReady(): boolean {
    return this.isLoaded && this.chunks !== null;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    if (typeof window === 'undefined') return null;
    
    const cached = localStorage.getItem('dr-clevens-knowledge-cache');
    if (!cached) return { cached: false };
    
    try {
      const cacheData = JSON.parse(cached);
      const ageInHours = (Date.now() - cacheData.timestamp) / (1000 * 60 * 60);
      
      return {
        cached: true,
        ageInHours: Math.round(ageInHours * 100) / 100,
        version: cacheData.version,
        chunks: cacheData.chunks?.length || 0,
        sizeKB: Math.round(cached.length / 1024)
      };
    } catch {
      return { cached: false };
    }
  }
}

export const preprocessedKnowledgeLoader = PreprocessedKnowledgeLoader.getInstance();