import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config({ path: '.env' });

const dataDir = path.join(process.cwd(), 'data');
const modelPath = path.join(process.cwd(), 'lib/tfidf-model.json'); 
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'histopath-tfidf';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '') 
    .split(/\s+/)
    .filter(word => word.length > 2); 
}

function calculateTF(tokens) {
  const tf = {};
  const totalTerms = tokens.length;
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  Object.keys(tf).forEach(token => {
    tf[token] = tf[token] / totalTerms;
  });
  return tf;
}

async function processFiles() {
  console.log('Starting TF-IDF Vectorization to Pinecone...');
  
  let chunksRaw = [];
  const docFrequencies = {};
  
  const existingIndexes = await pinecone.listIndexes();
  if (!existingIndexes.indexes.some(i => i.name === INDEX_NAME)) {
    console.log(`Creating index: ${INDEX_NAME}...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 2, 
      metric: 'dotproduct', 
      spec: { 
        serverless: { cloud: 'aws', region: 'us-east-1' } 
      } 
    });
    await new Promise(resolve => setTimeout(resolve, 10000)); 
  }
  const index = pinecone.index(INDEX_NAME);

  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));
    console.log('Building Vocabulary...');
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      const fileChunks = content.split('\n\n').filter(chunk => chunk.trim().length > 0);

      for (const chunkText of fileChunks) {
        const tokens = tokenize(chunkText);
        const uniqueTokens = new Set(tokens);

        uniqueTokens.forEach(token => {
          docFrequencies[token] = (docFrequencies[token] || 0) + 1;
        });

        chunksRaw.push({
          source: file,
          content: chunkText,
          tokens: tokens
        });
      }
    }

    const totalDocuments = chunksRaw.length;
    const idf = {};
    const vocabulary = Object.keys(docFrequencies).sort();

    vocabulary.forEach(word => {
      idf[word] = Math.log(totalDocuments / (docFrequencies[word] + 1));
    });

    const tfidfModel = {
      idf: idf,
      vocabulary: vocabulary
    };
    fs.writeFileSync(modelPath, JSON.stringify(tfidfModel, null, 2));
    console.log(`Saved TF-IDF model (Vocab & IDF) to ${modelPath}`);

    console.log('Uploading Sparse Vectors to Pinecone...');
    
    const vectorsToUpload = [];
    
    const vocabMap = new Map(vocabulary.map((w, i) => [w, i]));

    for (let i = 0; i < chunksRaw.length; i++) {
      const item = chunksRaw[i];
      const tf = calculateTF(item.tokens);
      
      const sparseIndices = [];
      const sparseValues = [];

      Object.keys(tf).forEach(word => {
        if (vocabMap.has(word)) {
          const tfVal = tf[word];
          const idfVal = idf[word];
          const score = tfVal * idfVal;
          
          sparseIndices.push(vocabMap.get(word));
          sparseValues.push(score);
        }
      });

      vectorsToUpload.push({
        id: `${item.source}-${i}`,
        values: [0.1, 0.1], 
        sparseValues: {
          indices: sparseIndices,
          values: sparseValues
        },
        metadata: {
          source: item.source,
          content: item.content
        }
      });

      if (vectorsToUpload.length >= 50) {
        await index.upsert(vectorsToUpload);
        vectorsToUpload.length = 0;
        console.log(`Processed ${i + 1}/${chunksRaw.length} chunks...`);
      }
    }

    if (vectorsToUpload.length > 0) {
      await index.upsert(vectorsToUpload);
    }

    console.log(`\nSuccessfully uploaded ${chunksRaw.length} documents to Pinecone.`);

  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();