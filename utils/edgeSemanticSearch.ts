// Edge-optimized semantic search for knowledge base
import Fuse, { IFuseOptions } from 'fuse.js';
import { KnowledgeChunk, SearchResult, KnowledgeBaseQuery, KnowledgeBaseResponse } from '@/types/knowledgeBase';

/**
 * Lightweight semantic search optimized for edge runtime
 */
export class EdgeSemanticSearch {
  private fuse: Fuse<KnowledgeChunk>;
  private chunks: KnowledgeChunk[];
  
  private options: IFuseOptions<KnowledgeChunk>;

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks;
    
    // Optimized Fuse.js configuration for edge performance
    this.options = {
      keys: [
        { name: 'content', weight: 0.6 },
        { name: 'keywords', weight: 0.3 },
        { name: 'procedure', weight: 0.1 }
      ],
      threshold: 0.4, // More lenient matching
      distance: 200,   // Reduced for faster search
      minMatchCharLength: 3,
      includeScore: true,
      includeMatches: false, // Disable for performance
      shouldSort: true,
      ignoreLocation: true,
      findAllMatches: false // Stop at first good match
    };
    
    this.fuse = new Fuse(chunks, this.options);
  }

  /**
   * Fast search optimized for edge runtime
   */
  search(query: KnowledgeBaseQuery): KnowledgeBaseResponse {
    const startTime = Date.now();
    const maxResults = Math.min(query.maxResults || 3, 5); // Limit for performance
    
    // Quick category/procedure filtering
    let searchChunks = this.chunks;
    if (query.category) {
      searchChunks = searchChunks.filter(chunk => chunk.category === query.category);
    }
    if (query.procedure) {
      searchChunks = searchChunks.filter(chunk => chunk.procedure === query.procedure);
    }
    
    // Use filtered chunks if significant reduction
    const useFilteredSearch = searchChunks.length < this.chunks.length * 0.7;
    const searchTarget = useFilteredSearch ? new Fuse(searchChunks, this.options) : this.fuse;
    
    // Perform search
    const fuseResults = searchTarget.search(query.query, { limit: maxResults });
    
    // Convert to SearchResult format
    const results: SearchResult[] = fuseResults.map(result => ({
      chunk: result.item,
      score: 1 - (result.score || 0) // Invert score (higher = better)
    }));
    
    // Filter by minimum score if specified
    const filteredResults = query.minScore 
      ? results.filter(r => r.score >= query.minScore!)
      : results;
    
    // Generate citations
    const citations = filteredResults.map((result, index) => ({
      id: `${index + 1}`,
      source: "Dr. Clevens Clinical Knowledge Base",
      pageNumber: result.chunk.pageNumber,
      content: result.chunk.content.substring(0, 100) + '...',
      procedure: result.chunk.procedure
    }));
    
    return {
      results: filteredResults,
      totalFound: filteredResults.length,
      processingTime: Date.now() - startTime,
      citations
    };
  }

  /**
   * Find relevant context with conversation history
   */
  findRelevantContext(
    userMessage: string,
    conversationHistory: string[] = [],
    maxResults: number = 3
  ): SearchResult[] {
    // Create expanded query from recent context
    const recentContext = conversationHistory.slice(-2).join(' ');
    const expandedQuery = `${userMessage} ${recentContext}`.trim();
    
    const query: KnowledgeBaseQuery = {
      query: expandedQuery,
      maxResults: Math.min(maxResults, 5),
      minScore: 0.3
    };
    
    return this.search(query).results;
  }

  /**
   * Get content by procedure (fast lookup)
   */
  getByProcedure(procedure: string, maxResults: number = 3): SearchResult[] {
    const results = this.chunks
      .filter(chunk => chunk.procedure === procedure)
      .slice(0, maxResults)
      .map(chunk => ({
        chunk,
        score: 1.0 // Perfect match
      }));
    
    return results;
  }

  /**
   * Get content by category (fast lookup)
   */
  getByCategory(category: string, maxResults: number = 3): SearchResult[] {
    const results = this.chunks
      .filter(chunk => chunk.category === category)
      .slice(0, maxResults)
      .map(chunk => ({
        chunk,
        score: 1.0 // Perfect match
      }));
    
    return results;
  }

  /**
   * Get search statistics
   */
  getStats() {
    const categories = new Set(this.chunks.map(c => c.category));
    const procedures = new Set(this.chunks.map(c => c.procedure).filter(Boolean));
    
    return {
      totalChunks: this.chunks.length,
      categories: categories.size,
      procedures: procedures.size,
      avgContentLength: this.chunks.reduce((sum, c) => sum + c.content.length, 0) / this.chunks.length
    };
  }
}

export default EdgeSemanticSearch;