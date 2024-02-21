import { type WeaviateClient } from 'weaviate-ts-client';
import { getWeaviateClient } from './client';

const client: WeaviateClient = getWeaviateClient();

const collectionExists = async (name: string) => {
  return client.schema.exists(name);
}

export const createBindCollection = async (name: string) => {
  if(await collectionExists(name)) {
    console.log(`The collection [${name}] already exists. No need to create it.`);
    return;
  }
  
  console.log(`Creating collection [${name}].`);

  const bindSchema = {
    class: name,
    moduleConfig: {
      'multi2vec-clip': {
        textFields: ['name', 'title', 'overview', 'media'],
        imageFields: ['image'],
      }
    },
    properties: [
      {
        name: 'name',
        dataType: ['text'],
        moduleConfig: {
          'multi2vec-clip': { skip: true },
        },
      },
      {
        name: 'media',
        dataType: ['text'],
        moduleConfig: {
          'multi2vec-clip': { skip: true },
        },
      },
      {
        name: 'image',
        dataType: ['blob'] ,
      },
      {
        name: 'idnum',
        dataType: ['int'] ,
      },
      {
        name: 'title',
        dataType: ['text'],
      },
      {
        name: 'overview',
        dataType: ['text'],
      }
    ],
    vectorIndexType: 'hnsw',
    vectorizer: 'multi2vec-clip'
  }
  
  const res = await client
    .schema.classCreator()
    .withClass(bindSchema)
    .do();

  console.log(JSON.stringify(res, null, 2));
}

export const deleteCollection = async (name: string) => {
  console.log(`Deleting collection ${name}...`);
  await client.schema
  .classDeleter()
  .withClassName(name)
  .do();

  console.log(`Deleted collection ${name}.`);
}