import { type WeaviateClient, generateUuid5, toBase64FromMedia } from 'weaviate-client';
import { getWeaviateClient } from './client';
import { getBase64, listFiles } from './util';

const sourceBase = 'public';
const sourceImages = sourceBase + '/images/'

const client: WeaviateClient = await getWeaviateClient();

export const importMediaFiles = async (collectionName: string) => {
    await insertImages(collectionName);
}

// for any images in images folder not in csv, insert without metadata
const insertImages = async (collectionName: string) => {

    const batchSize = 20;
    let dataObject = [];
    const imagesCollection = client.collections.use(collectionName);

    const files = listFiles(sourceImages);
    console.log(`Importing ${files.length} images.`);

    let counter = 0;
    for (const file of files) {
        console.log(`Adding ${file.name}`);

        const item = {
            name: file.name,
            image: await toBase64FromMedia(file.path),
        };

        dataObject.push(item);
        counter++;

        if (counter % batchSize == 0) {
            let response = await imagesCollection.data.insertMany(dataObject);
            // Clear the dataObject array
            dataObject = [];
            console.log(response)
        }
        
    }

    if (counter % batchSize !== 0)
        await imagesCollection.data.insertMany(dataObject);


    const response = await imagesCollection.query.fetchObjects({limit:10})
    console.info("fetched objects",response.objects)
}

