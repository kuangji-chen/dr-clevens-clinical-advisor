#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function buildKnowledgeBase() {
  console.log('🔄 Building knowledge base...');
  
  try {
    // Simple PDF content extraction using pdf-parse directly
    const pdfPath = path.join(process.cwd(), 'public', 'clevens-clinic-knowledge.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }
    
    console.log('📄 Extracting PDF content...');
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`✅ Extracted ${pdfData.text.length} characters`);
    
    // Simple chunking
    console.log('🔨 Creating knowledge chunks...');
    const chunks = createChunks(pdfData.text);
    console.log(`✅ Created ${chunks.length} chunks`);
    
    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write chunks to JSON file
    const outputPath = path.join(publicDir, 'knowledge-chunks.json');
    fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
    
    // Write metadata
    const metadata = {
      totalChunks: chunks.length,
      totalCharacters: pdfData.text.length,
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const metadataPath = path.join(publicDir, 'knowledge-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log(`✅ Knowledge base built successfully!`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Chunks: ${chunks.length}`);
    console.log(`📏 Size: ${Math.round(fs.statSync(outputPath).size / 1024)} KB`);
    
  } catch (error) {
    console.error('❌ Failed to build knowledge base:', error);
    process.exit(1);
  }
}

function createChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let currentChunk = '';
  let chunkId = 1;
  
  for (const paragraph of paragraphs) {
    const cleanParagraph = paragraph.trim();
    
    if (currentChunk.length + cleanParagraph.length > chunkSize && currentChunk.length > 0) {
      const chunk = {
        id: chunkId.toString(),
        content: currentChunk.trim(),
        pageNumber: 1,
        keywords: extractKeywords(currentChunk),
        category: categorizeContent(currentChunk),
        procedure: identifyProcedure(currentChunk)
      };
      chunks.push(chunk);
      
      // Handle overlap
      const sentences = currentChunk.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const overlapSentences = sentences.slice(-Math.ceil(overlap / 100)).join('. ');
      currentChunk = overlapSentences + (overlapSentences ? '. ' : '') + cleanParagraph;
      chunkId++;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + cleanParagraph;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    const chunk = {
      id: chunkId.toString(),
      content: currentChunk.trim(),
      pageNumber: 1,
      keywords: extractKeywords(currentChunk),
      category: categorizeContent(currentChunk),
      procedure: identifyProcedure(currentChunk)
    };
    chunks.push(chunk);
  }
  
  return chunks;
}

function extractKeywords(content) {
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
  
  return medicalKeywords.filter(keyword => text.includes(keyword.toLowerCase())).slice(0, 10);
}

function categorizeContent(content) {
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

function identifyProcedure(content) {
  const text = content.toLowerCase();
  const procedures = [
    'rhinoplasty', 'facelift', 'brow lift', 'eyelid surgery',
    'mommy makeover', 'tummy tuck', 'breast augmentation',
    'breast lift', 'breast reduction', 'liposuction',
    'botox', 'dermal fillers'
  ];
  
  for (const procedure of procedures) {
    if (text.includes(procedure)) {
      return procedure;
    }
  }
  
  return undefined;
}

buildKnowledgeBase();