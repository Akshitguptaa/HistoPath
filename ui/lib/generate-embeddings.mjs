import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
  throw new Error("HF_API_KEY is not defined in environment variables");
}

const hf = new HfInference(HF_API_KEY);

const dataDir = path.join(process.cwd(), 'data');
const vectorStorePath = path.join(process.cwd(), 'lib/vector-store.json');
const model = "BAAI/bge-small-en-v1.5"; 

async function createEmbedding(text) {
  try {
    const response = await hf.featureExtraction({
      model: model,
      inputs: text.replace(/\n/g, ' '),
    });

    if (Array.isArray(response) && typeof response[0] === 'number') {
      return response; 
    }
    if (Array.isArray(response) && Array.isArray(response[0])) {
      return response[0]; 
    }
    
    throw new Error('Invalid response format from Hugging Face API');

  } catch (error) {
    console.error(`Error creating embedding for text: ${text.substring(0, 20)}...`, error);
    throw error;
  }
}

async function processFiles() {
  console.log(`Starting embedding generation using Hugging Face (${model})...`);
  const vectorStore = [];

  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));

    for (const file of files) {
      console.log(`Processing file: ${file}...`);
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      
      const chunks = content.split('\n\n').filter(chunk => chunk.trim().length > 0);

      for (const chunk of chunks) {
        console.log(`  Embedding chunk: "${chunk.substring(0, 40)}..."`);
        const embedding = await createEmbedding(chunk);
        
        vectorStore.push({
          source: file,
          content: chunk,
          embedding: embedding,
        });
      }
    }

    fs.writeFileSync(vectorStorePath, JSON.stringify(vectorStore, null, 2));
    console.log(`\nSuccessfully created vector store at: ${vectorStorePath}`);
    console.log(`Total vectors created: ${vectorStore.length}`);

  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();