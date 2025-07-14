#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function buildKnowledgeBase() {
  console.log('🔄 Building knowledge base...');
  
  try {
    // For CommonJS, use require with TypeScript compilation
    require('ts-node/register');
    const { PDFProcessor } = require('../utils/pdfProcessor.ts');
    
    // Initialize processor with explicit path
    const pdfPath = path.join(process.cwd(), 'public', 'clevens-clinic-knowledge.pdf');
    const processor = new PDFProcessor(pdfPath);
    
    // Extract PDF content
    console.log('📄 Extracting PDF content...');
    const pdfContent = await processor.extractPDFContent();
    console.log(`✅ Extracted ${pdfContent.text.length} characters`);
    
    // Create chunks
    console.log('🔨 Creating knowledge chunks...');
    const chunks = processor.chunkContent(pdfContent);
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
      totalCharacters: pdfContent.text.length,
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

buildKnowledgeBase();