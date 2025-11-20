import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const dataDir = path.join(process.cwd(), 'data');
const vectorStorePath = path.join(process.cwd(), 'lib/vector-store.json');

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
  
  // Normalize TF
  Object.keys(tf).forEach(token => {
    tf[token] = tf[token] / totalTerms;
  });
  return tf;
}

async function processFiles() {
  console.log('Starting TF-IDF vectorization from scratch...');
  
  let chunksRaw = [];
  const docFrequencies = {};
  const allDocuments = [];

  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));

    // pass 1- Build Vocabulary and Document Frequencies 
    console.log('Pass 1: Building Vocabulary...');
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      const fileChunks = content.split('\n\n').filter(chunk => chunk.trim().length > 0);

      for (const chunkText of fileChunks) {
        const tokens = tokenize(chunkText);
        const uniqueTokens = new Set(tokens); // Count a word only once per doc for IDF

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

    // Pass 2: Generate Vectors 
    console.log('Pass 2: Generating Vectors...');
    
    const vectorStore = {
      idf: idf,
      vocabulary: vocabulary,
      documents: []
    };

    for (const item of chunksRaw) {
      const tf = calculateTF(item.tokens);
      
      const vector = vocabulary.map(word => {
        const tfVal = tf[word] || 0;
        const idfVal = idf[word] || 0;
        return tfVal * idfVal;
      });

      vectorStore.documents.push({
        source: item.source,
        content: item.content,
        embedding: vector 
      });
    }

    fs.writeFileSync(vectorStorePath, JSON.stringify(vectorStore, null, 2));
    console.log(`\nSuccessfully created TF-IDF store at: ${vectorStorePath}`);
    console.log(`Total Vocabulary Size: ${vocabulary.length}`);
    console.log(`Total Documents Processed: ${vectorStore.documents.length}`);

  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();