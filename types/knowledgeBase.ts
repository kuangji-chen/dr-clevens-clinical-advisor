// Knowledge base types for PDF processing and search

export interface PDFContent {
  text: string;
  pageNumber: number;
  totalPages: number;
  metadata?: PDFMetadata;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface KnowledgeChunk {
  id: string;
  content: string;
  pageNumber: number;
  procedure?: string;
  category?: KnowledgeCategory;
  keywords: string[];
  relevanceScore?: number;
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  highlightedContent?: string;
}

export interface KnowledgeBaseQuery {
  query: string;
  procedure?: string;
  category?: KnowledgeCategory;
  maxResults?: number;
  minScore?: number;
}

export interface KnowledgeBaseResponse {
  results: SearchResult[];
  totalFound: number;
  processingTime: number;
  citations: Citation[];
}

export interface Citation {
  id: string;
  source: string;
  pageNumber: number;
  content: string;
  procedure?: string;
}

export type KnowledgeCategory = 
  | 'general'
  | 'rhinoplasty'
  | 'facial_rejuvenation'
  | 'mommy_makeover'
  | 'breast_surgery'
  | 'body_contouring'
  | 'non_surgical'
  | 'recovery'
  | 'consultation'
  | 'safety'
  | 'credentials';

export interface ProcessedKnowledgeBase {
  chunks: KnowledgeChunk[];
  categories: Record<KnowledgeCategory, KnowledgeChunk[]>;
  procedures: Record<string, KnowledgeChunk[]>;
  lastUpdated: Date;
  version: string;
}