import fs from 'fs';
import path from 'path';
import { PDFContent, PDFMetadata, KnowledgeChunk, KnowledgeCategory } from '@/types/knowledgeBase';

/**
 * PDF Processing utility for extracting and structuring content from clinic knowledge base
 */
export class PDFProcessor {
  private static instance: PDFProcessor;
  private pdfPath: string;

  constructor(pdfPath?: string) {
    this.pdfPath = pdfPath || path.join(process.cwd(), 'public', 'clevens-clinic-knowledge.pdf');
  }

  static getInstance(pdfPath?: string): PDFProcessor {
    if (!PDFProcessor.instance) {
      PDFProcessor.instance = new PDFProcessor(pdfPath);
    }
    return PDFProcessor.instance;
  }

  /**
   * Extract text content from PDF file
   */
  async extractPDFContent(): Promise<PDFContent> {
    try {
      if (!fs.existsSync(this.pdfPath)) {
        console.warn(`PDF file not found: ${this.pdfPath}`);
        throw new Error(`PDF file not found: ${this.pdfPath}`);
      }

      const dataBuffer = fs.readFileSync(this.pdfPath);
      
      // Import pdf-parse dynamically to avoid build issues
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(dataBuffer);

      return {
        text: pdfData.text,
        pageNumber: 1,
        totalPages: pdfData.numpages,
        metadata: {
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          subject: pdfData.info?.Subject,
          creator: pdfData.info?.Creator,
          producer: pdfData.info?.Producer,
          creationDate: pdfData.info?.CreationDate,
          modificationDate: pdfData.info?.ModDate,
        }
      };
    } catch (error) {
      console.error('Error extracting PDF content:', error);
      throw new Error(`Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Split PDF content into manageable chunks for search and Claude context
   */
  chunkContent(content: PDFContent, chunkSize: number = 1000, overlap: number = 200): KnowledgeChunk[] {
    const text = content.text;
    const chunks: KnowledgeChunk[] = [];
    
    // Split by paragraphs first to maintain coherent sections
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    let currentChunk = '';
    let chunkId = 1;
    
    for (const paragraph of paragraphs) {
      const cleanParagraph = paragraph.trim();
      
      // If adding this paragraph would exceed chunk size, create a new chunk
      if (currentChunk.length + cleanParagraph.length > chunkSize && currentChunk.length > 0) {
        const chunk = this.createKnowledgeChunk(
          chunkId.toString(),
          currentChunk,
          content.pageNumber,
          content.totalPages
        );
        chunks.push(chunk);
        
        // Handle overlap by keeping last few sentences
        const sentences = currentChunk.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const overlapSentences = sentences.slice(-Math.ceil(overlap / 100)).join('. ');
        currentChunk = overlapSentences + (overlapSentences ? '. ' : '') + cleanParagraph;
        chunkId++;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + cleanParagraph;
      }
    }
    
    // Add the final chunk if there's remaining content
    if (currentChunk.trim().length > 0) {
      const chunk = this.createKnowledgeChunk(
        chunkId.toString(),
        currentChunk,
        content.pageNumber,
        content.totalPages
      );
      chunks.push(chunk);
    }
    
    return chunks;
  }

  /**
   * Create a structured knowledge chunk with categorization
   */
  private createKnowledgeChunk(
    id: string, 
    content: string, 
    pageNumber: number, 
    totalPages: number
  ): KnowledgeChunk {
    const chunk: KnowledgeChunk = {
      id,
      content: content.trim(),
      pageNumber,
      keywords: this.extractKeywords(content),
      category: this.categorizeContent(content),
      procedure: this.identifyProcedure(content)
    };
    
    return chunk;
  }

  /**
   * Extract relevant keywords from content
   */
  private extractKeywords(content: string): string[] {
    const text = content.toLowerCase();
    const medicalKeywords = [
      'rhinoplasty', 'nose job', 'nasal surgery',
      'facelift', 'facial rejuvenation', 'brow lift', 'eyelid surgery',
      'mommy makeover', 'tummy tuck', 'breast surgery', 'liposuction',
      'botox', 'fillers', 'non-surgical',
      'recovery', 'healing', 'consultation',
      'anesthesia', 'surgery', 'procedure',
      'results', 'before', 'after',
      'dr clevens', 'doctor', 'surgeon',
      'safety', 'complications', 'risks'
    ];
    
    const foundKeywords = medicalKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    // Also extract capitalized words that might be medical terms
    const capitalizedWords = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const uniqueCapitalized = [...new Set(capitalizedWords.map(w => w.toLowerCase()))];
    
    return [...new Set([...foundKeywords, ...uniqueCapitalized])].slice(0, 10);
  }

  /**
   * Categorize content based on medical procedure keywords
   */
  private categorizeContent(content: string): KnowledgeCategory {
    const text = content.toLowerCase();
    
    if (text.includes('rhinoplasty') || text.includes('nose')) return 'rhinoplasty';
    if (text.includes('facelift') || text.includes('facial') || text.includes('brow') || text.includes('eyelid')) return 'facial_rejuvenation';
    if (text.includes('mommy makeover') || text.includes('tummy tuck')) return 'mommy_makeover';
    if (text.includes('breast')) return 'breast_surgery';
    if (text.includes('liposuction') || text.includes('body') || text.includes('contouring')) return 'body_contouring';
    if (text.includes('botox') || text.includes('filler') || text.includes('non-surgical')) return 'non_surgical';
    if (text.includes('recovery') || text.includes('healing') || text.includes('post-op')) return 'recovery';
    if (text.includes('consultation') || text.includes('appointment')) return 'consultation';
    if (text.includes('safety') || text.includes('risk') || text.includes('complication')) return 'safety';
    if (text.includes('dr clevens') || text.includes('credential') || text.includes('board')) return 'credentials';
    
    return 'general';
  }

  /**
   * Identify specific procedures mentioned in content
   */
  private identifyProcedure(content: string): string | undefined {
    const text = content.toLowerCase();
    const procedures = [
      'rhinoplasty',
      'facelift', 
      'brow lift',
      'eyelid surgery',
      'mommy makeover',
      'tummy tuck',
      'breast augmentation',
      'breast lift',
      'breast reduction',
      'liposuction',
      'botox',
      'dermal fillers'
    ];
    
    for (const procedure of procedures) {
      if (text.includes(procedure)) {
        return procedure;
      }
    }
    
    return undefined;
  }
}

export default PDFProcessor;