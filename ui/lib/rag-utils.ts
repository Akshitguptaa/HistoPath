import { HfInference } from '@huggingface/inference';
import vectorStore from './vector-store.json';

interface VectorStoreEntry {
  source: string;
  content: string;
  embedding: number[];
}

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
  throw new Error("HF_API_KEY is not defined in environment variables");
}

const hf = new HfInference(HF_API_KEY);
const model = "BAAI/bge-small-en-v1.5";

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  const vecLength = vecA.length; 
  for (let i = 0; i < vecLength; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0; 
  
  return dotProduct / magnitude;
}

async function createEmbedding(text: string): Promise<number[]> {
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
    console.error('Error creating embedding for prompt:', error);
    throw error;
  }
}

export async function retrieveContext(prompt: string, topK: number = 3): Promise<string | null> {
  try {
    const promptEmbedding = await createEmbedding(prompt);
    const store = vectorStore as VectorStoreEntry[];

    const similarities = store.map(entry => ({
      ...entry,
      similarity: cosineSimilarity(promptEmbedding, entry.embedding),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    const topKEntries = similarities.slice(0, topK);
    
    if (topKEntries.length === 0 || topKEntries[0].similarity < 0.3) {
      return null;
    }

    const context = topKEntries
      .map(entry => `[Source: ${entry.source}]\n${entry.content}`)
      .join('\n\n');
      
    return context;

  } catch (error) {
    console.error('Error retrieving context:', error);
    return null;
  }
}