import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';
import { 
  KnowledgeChunk, 
  SearchResult, 
  KnowledgeBaseQuery, 
  KnowledgeBaseResponse,
  Citation 
} from '@/types/knowledgeBase';

/**
 * Semantic search service for knowledge base content
 */
export class SemanticSearch {
  private fuse!: Fuse<KnowledgeChunk>;
  private chunks: KnowledgeChunk[];

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks;
    this.initializeFuse();
  }

  /**
   * Initialize Fuse.js for fuzzy search
   */
  private initializeFuse(): void {
    const options: IFuseOptions<KnowledgeChunk> = {
      includeScore: true,
      includeMatches: true,
      threshold: 0.4, // Lower = more strict matching
      minMatchCharLength: 3,
      keys: [
        {
          name: 'content',
          weight: 0.7
        },
        {
          name: 'keywords',
          weight: 0.2
        },
        {
          name: 'procedure',
          weight: 0.1
        }
      ]
    };

    this.fuse = new Fuse(this.chunks, options);
  }

  /**
   * Search knowledge base for relevant content
   */
  async search(query: KnowledgeBaseQuery): Promise<KnowledgeBaseResponse> {
    const startTime = Date.now();
    
    // Perform fuzzy search
    const fuseResults = this.fuse.search(query.query);
    
    // Filter by procedure if specified
    let filteredResults = fuseResults;
    if (query.procedure) {
      filteredResults = fuseResults.filter(result => 
        result.item.procedure?.toLowerCase().includes(query.procedure!.toLowerCase()) ||
        result.item.content.toLowerCase().includes(query.procedure!.toLowerCase())
      );
    }

    // Filter by category if specified
    if (query.category) {
      filteredResults = filteredResults.filter(result => 
        result.item.category === query.category
      );
    }

    // Filter by minimum score
    const minScore = query.minScore || 0.3;
    filteredResults = filteredResults.filter(result => 
      (result.score || 1) <= (1 - minScore) // Fuse scores are inverted (lower = better)
    );

    // Limit results
    const maxResults = query.maxResults || 5;
    const limitedResults = filteredResults.slice(0, maxResults);

    // Convert to SearchResult format
    const searchResults: SearchResult[] = limitedResults.map((result, index) => ({
      chunk: result.item,
      score: 1 - (result.score || 0), // Convert to positive score
      highlightedContent: this.highlightMatches(result.item.content, result.matches)
    }));

    // Generate citations
    const citations: Citation[] = searchResults.map((result, index) => ({
      id: `cite-${index + 1}`,
      source: 'Dr. Clevens Clinical Knowledge Base',
      pageNumber: result.chunk.pageNumber,
      content: result.chunk.content.substring(0, 200) + '...',
      procedure: result.chunk.procedure
    }));

    const processingTime = Date.now() - startTime;

    return {
      results: searchResults,
      totalFound: filteredResults.length,
      processingTime,
      citations
    };
  }

  /**
   * Get content by specific procedure
   */
  async getByProcedure(procedure: string, maxResults: number = 3): Promise<SearchResult[]> {
    const procedureChunks = this.chunks.filter(chunk => 
      chunk.procedure?.toLowerCase().includes(procedure.toLowerCase()) ||
      chunk.content.toLowerCase().includes(procedure.toLowerCase())
    );

    return procedureChunks.slice(0, maxResults).map(chunk => ({
      chunk,
      score: 1.0, // Perfect match since we're filtering specifically
      highlightedContent: chunk.content
    }));
  }

  /**
   * Get content by category
   */
  async getByCategory(category: string, maxResults: number = 3): Promise<SearchResult[]> {
    const categoryChunks = this.chunks.filter(chunk => 
      chunk.category === category
    );

    return categoryChunks.slice(0, maxResults).map(chunk => ({
      chunk,
      score: 1.0,
      highlightedContent: chunk.content
    }));
  }

  /**
   * Find most relevant content based on conversation context
   */
  async findRelevantContext(
    userMessage: string, 
    conversationHistory: string[],
    maxResults: number = 3
  ): Promise<SearchResult[]> {
    // Combine user message with recent conversation for better context
    const recentHistory = conversationHistory.slice(-3).join(' ');
    const combinedQuery = `${userMessage} ${recentHistory}`;
    
    const query: KnowledgeBaseQuery = {
      query: combinedQuery,
      maxResults,
      minScore: 0.2
    };

    const response = await this.search(query);
    return response.results;
  }

  /**
   * Highlight search matches in content
   */
  private highlightMatches(content: string, matches?: any): string {
    if (!matches || matches.length === 0) {
      return content;
    }

    let highlightedContent = content;
    
    // Sort matches by position to avoid offset issues
    const sortedMatches = matches
      .filter((match: any) => match.key === 'content' && match.indices)
      .sort((a: any, b: any) => (a.indices?.[0]?.[0] || 0) - (b.indices?.[0]?.[0] || 0));

    // Apply highlights in reverse order to maintain indices
    for (let i = sortedMatches.length - 1; i >= 0; i--) {
      const match = sortedMatches[i];
      if (match.indices) {
        for (let j = match.indices.length - 1; j >= 0; j--) {
          const [start, end] = match.indices[j];
          const before = highlightedContent.substring(0, start);
          const matched = highlightedContent.substring(start, end + 1);
          const after = highlightedContent.substring(end + 1);
          highlightedContent = `${before}**${matched}**${after}`;
        }
      }
    }

    return highlightedContent;
  }

  /**
   * Get knowledge base statistics
   */
  getStats() {
    const stats = {
      totalChunks: this.chunks.length,
      procedures: [...new Set(this.chunks.map(c => c.procedure).filter(Boolean))],
      categories: [...new Set(this.chunks.map(c => c.category))],
      averageChunkLength: Math.round(
        this.chunks.reduce((sum, chunk) => sum + chunk.content.length, 0) / this.chunks.length
      ),
      totalKeywords: [...new Set(this.chunks.flatMap(c => c.keywords))].length
    };

    return stats;
  }
}

export default SemanticSearch;