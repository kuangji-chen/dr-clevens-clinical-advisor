import { PDFProcessor } from './pdfProcessor';
import { SemanticSearch } from './semanticSearch';
import { EdgeSemanticSearch } from './edgeSemanticSearch';
import { preprocessedKnowledgeLoader } from './preprocessedKnowledgeLoader';
import { 
  KnowledgeChunk, 
  ProcessedKnowledgeBase, 
  KnowledgeBaseQuery,
  KnowledgeBaseResponse,
  SearchResult 
} from '@/types/knowledgeBase';

/**
 * Main knowledge base service that orchestrates PDF processing and search
 */
export class KnowledgeBaseService {
  private static instance: KnowledgeBaseService;
  private pdfProcessor: PDFProcessor;
  private semanticSearch: SemanticSearch | EdgeSemanticSearch | null = null;
  private processedKnowledge: ProcessedKnowledgeBase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private useEdgeOptimized = false;

  constructor() {
    this.pdfProcessor = PDFProcessor.getInstance();
    // Use edge-optimized search in production for better performance
    this.useEdgeOptimized = process.env.NODE_ENV === 'production';
  }

  static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService();
    }
    return KnowledgeBaseService.instance;
  }

  /**
   * Initialize the knowledge base by processing PDF content
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initialize();
    return this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      console.log('🔄 Initializing knowledge base...');
      
      // Try to load preprocessed chunks first
      const chunks = await preprocessedKnowledgeLoader.loadKnowledgeBase();
      
      if (chunks.length > 0) {
        console.log(`📋 Using preprocessed chunks: ${chunks.length} items`);
        
        // Initialize search service with optimal implementation
        if (this.useEdgeOptimized) {
          console.log('⚡ Using edge-optimized search for production');
          this.semanticSearch = new EdgeSemanticSearch(chunks);
        } else {
          console.log('🔍 Using full semantic search for development');
          this.semanticSearch = new SemanticSearch(chunks);
        }
        
        // Process into organized structure
        this.processedKnowledge = this.organizeKnowledge(chunks);
        
        this.isInitialized = true;
        console.log('✅ Knowledge base initialized with preprocessed data');
        return;
      }
      
      // Fallback to PDF processing if no preprocessed data
      console.log('⚠️ No preprocessed data found, falling back to PDF processing...');
      
      // Extract PDF content (original flow)
      const pdfContent = await this.pdfProcessor.extractPDFContent();
      console.log(`📄 Extracted ${pdfContent.text.length} characters from PDF`);
      
      // Chunk the content
      const pdfChunks = this.pdfProcessor.chunkContent(pdfContent);
      console.log(`📋 Created ${pdfChunks.length} knowledge chunks`);
      
      // Initialize search service
      if (this.useEdgeOptimized) {
        this.semanticSearch = new EdgeSemanticSearch(pdfChunks);
      } else {
        this.semanticSearch = new SemanticSearch(pdfChunks);
      }
      
      // Process into organized structure
      this.processedKnowledge = this.organizeKnowledge(pdfChunks);
      
      this.isInitialized = true;
      console.log('✅ Knowledge base initialized with PDF processing fallback');
      
    } catch (error) {
      console.error('❌ Failed to initialize knowledge base:', error);
      this.initPromise = null; // Allow retry
      throw error;
    }
  }

  /**
   * Organize chunks into categories and procedures
   */
  private organizeKnowledge(chunks: KnowledgeChunk[]): ProcessedKnowledgeBase {
    const categories = {
      general: [] as KnowledgeChunk[],
      rhinoplasty: [] as KnowledgeChunk[],
      facial_rejuvenation: [] as KnowledgeChunk[],
      mommy_makeover: [] as KnowledgeChunk[],
      breast_surgery: [] as KnowledgeChunk[],
      body_contouring: [] as KnowledgeChunk[],
      non_surgical: [] as KnowledgeChunk[],
      recovery: [] as KnowledgeChunk[],
      consultation: [] as KnowledgeChunk[],
      safety: [] as KnowledgeChunk[],
      credentials: [] as KnowledgeChunk[]
    };

    const procedures: Record<string, KnowledgeChunk[]> = {};

    chunks.forEach(chunk => {
      // Organize by category
      if (chunk.category && categories[chunk.category]) {
        categories[chunk.category].push(chunk);
      }

      // Organize by procedure
      if (chunk.procedure) {
        if (!procedures[chunk.procedure]) {
          procedures[chunk.procedure] = [];
        }
        procedures[chunk.procedure].push(chunk);
      }
    });

    return {
      chunks,
      categories,
      procedures,
      lastUpdated: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Search knowledge base for relevant content
   */
  async search(query: KnowledgeBaseQuery): Promise<KnowledgeBaseResponse> {
    await this.initialize();
    
    if (!this.semanticSearch) {
      throw new Error('Knowledge base not properly initialized');
    }

    return this.semanticSearch.search(query);
  }

  /**
   * Get relevant context for a user query with conversation history
   */
  async getRelevantContext(
    userMessage: string,
    conversationHistory: string[] = [],
    maxResults: number = 3
  ): Promise<{
    context: string;
    citations: string[];
    relevantChunks: SearchResult[];
  }> {
    await this.initialize();
    
    if (!this.semanticSearch) {
      throw new Error('Knowledge base not properly initialized');
    }

    // Find relevant content
    const relevantChunks = await this.semanticSearch.findRelevantContext(
      userMessage,
      conversationHistory,
      maxResults
    );

    // Build context string for Claude
    const context = relevantChunks
      .map((result, index) => `[Source ${index + 1}] ${result.chunk.content}`)
      .join('\n\n');

    // Generate citations
    const citations = relevantChunks.map((result, index) => 
      `[${index + 1}] Dr. Clevens Clinical Knowledge Base, Page ${result.chunk.pageNumber}${
        result.chunk.procedure ? ` - ${result.chunk.procedure}` : ''
      }`
    );

    return {
      context,
      citations,
      relevantChunks
    };
  }

  /**
   * Get content by procedure type
   */
  async getByProcedure(procedure: string, maxResults: number = 3): Promise<SearchResult[]> {
    await this.initialize();
    
    if (!this.semanticSearch) {
      throw new Error('Knowledge base not properly initialized');
    }

    return this.semanticSearch.getByProcedure(procedure, maxResults);
  }

  /**
   * Get content by category
   */
  async getByCategory(category: string, maxResults: number = 3): Promise<SearchResult[]> {
    await this.initialize();
    
    if (!this.semanticSearch) {
      throw new Error('Knowledge base not properly initialized');
    }

    return this.semanticSearch.getByCategory(category, maxResults);
  }

  /**
   * Check if knowledge base is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.semanticSearch !== null;
  }

  /**
   * Get knowledge base statistics
   */
  async getStats() {
    await this.initialize();
    
    if (!this.semanticSearch || !this.processedKnowledge) {
      throw new Error('Knowledge base not properly initialized');
    }

    const searchStats = this.semanticSearch.getStats();
    
    return {
      ...searchStats,
      lastUpdated: this.processedKnowledge.lastUpdated,
      version: this.processedKnowledge.version,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Reinitialize knowledge base (useful for PDF updates)
   */
  async reinitialize(): Promise<void> {
    this.isInitialized = false;
    this.initPromise = null;
    this.semanticSearch = null;
    this.processedKnowledge = null;
    
    await this.initialize();
  }

  /**
   * Fallback medical context for when PDF processing fails
   */
  getFallbackContext(): string {
    return `
You are Dr. Clevens' AI assistant, helping patients explore cosmetic and aesthetic procedures.
IMPORTANT: Be CONCISE (1-2 sentences) while maintaining a warm, professional, and empathetic tone.

ABOUT DR. CLEVENS:
- Board-certified plastic surgeon
- Specializes in facial rejuvenation, rhinoplasty, and body contouring
- Known for natural-looking results
- Offers complimentary consultations

KEY PROCEDURES:
1. RHINOPLASTY
   - Recovery: 7-10 days back to work, final results at 12 months
   - Addresses: dorsal humps, crooked noses, tip refinement
   - Technique: Closed or open approach based on case complexity

2. FACIAL REJUVENATION
   - Facelifts, brow lifts, eyelid surgery
   - Non-surgical options: Botox, fillers
   - Recovery varies by procedure

3. MOMMY MAKEOVER
   - Combines tummy tuck, breast surgery, liposuction
   - Customized to individual needs
   - Best performed after done having children

Note: This response is based on general knowledge. Please consult directly for personalized advice.
`;
  }
}

// Export singleton instance
export const knowledgeBase = KnowledgeBaseService.getInstance();
export default KnowledgeBaseService;