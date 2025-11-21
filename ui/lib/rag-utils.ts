import pinecone, { indexName } from './pinecone';
import modelData from './tfidf-model.json'; 

interface TFIDFModel {
  idf: Record<string, number>;
  vocabulary: string[];
}

const model = modelData as TFIDFModel;
const vocabMap = new Map(model.vocabulary.map((w, i) => [w, i]));

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function createSparseVector(text: string): { indices: number[], values: number[] } {
  const tokens = tokenize(text);
  const totalTerms = tokens.length;
  
  if (totalTerms === 0) return { indices: [], values: [] };

  const tf: Record<string, number> = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });

  const indices: number[] = [];
  const values: number[] = [];

  Object.keys(tf).forEach(word => {
    if (vocabMap.has(word)) {
      const tfVal = (tf[word]) / totalTerms;
      const idfVal = model.idf[word] || 0;
      const score = tfVal * idfVal;

      indices.push(vocabMap.get(word)!);
      values.push(score);
    }
  });

  return { indices, values };
}

export async function retrieveContext(prompt: string, topK: number = 3): Promise<string | null> {
  try {
    const sparseVec = createSparseVector(prompt);

    if (sparseVec.indices.length === 0) {
      console.log("Query contained no known vocabulary words.");
      return null;
    }

    const index = pinecone.index(indexName);
    
    const result = await index.query({
      topK: topK,
      vector: [0.1, 0.1], 
      sparseVector: sparseVec, 
      includeMetadata: true,
    });

    if (!result.matches || result.matches.length === 0) {
      return null;
    }

    const context = result.matches
      .map(match => `[Source: ${match.metadata?.source}]\n${match.metadata?.content}`)
      .join('\n\n');
      
    return context;

  } catch (error) {
    console.error('Error retrieving context:', error);
    return null;
  }
}