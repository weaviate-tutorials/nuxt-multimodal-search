import weaviate, { type WeaviateClient } from 'weaviate-client';
import 'dotenv/config'

let client: WeaviateClient;

export const getWeaviateClient = async () => {
  if (!client) {
    client = await weaviate.connectToLocal({
    headers: {
      'X-Cohere-Api-Key': process.env.NUXT_COHERE_APIKEY || '',  // Replace with your inference API key
    }
  }
)
  };
  
 return client;
}