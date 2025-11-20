import storeData from './vector-store.json';

interface TFIDFStore {
  idf: Record<string, number>;
  vocabulary: string[];
  documents: VectorStoreEntry[];
}

interface VectorStoreEntry {
  source: string;
  content: string;
  embedding: number[];
}

const store = storeData as TFIDFStore;

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function createTFIDFVector(text: string): number[] {
  const tokens = tokenize(text);
  const totalTerms = tokens.length;
  
  if (totalTerms === 0) return new Array(store.vocabulary.length).fill(0);

  const tf: Record<string, number> = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });

  return store.vocabulary.map(word => {
    // Normalised TF * Stored IDF
    const tfVal = (tf[word] || 0) / totalTerms; 
    const idfVal = store.idf[word] || 0;
    return tfVal * idfVal;
  });
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    if (vecA[i] !== 0 || vecB[i] !== 0) { 
        dotProduct += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }
  }
  
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0; 
  
  return dotProduct / magnitude;
}

export async function retrieveContext(prompt: string, topK: number = 3): Promise<string | null> {
  try {
    // Vectorize using the SAME rules 
    const promptVector = createTFIDFVector(prompt);

    // compare against all stored documents
    const similarities = store.documents.map(entry => ({
      ...entry,
      similarity: cosineSimilarity(promptVector, entry.embedding),
    }));

    // sort by highest similarity
    similarities.sort((a, b) => b.similarity - a.similarity);

    const topKEntries = similarities.slice(0, topK);
    
    if (topKEntries.length === 0 || topKEntries[0].similarity === 0) {
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