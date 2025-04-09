import weaviate, { WeaviateClient } from "weaviate-client"

export default defineLazyEventHandler(async () => {
  const config = useRuntimeConfig()

  const client: WeaviateClient = await weaviate.connectToLocal({
    headers: {
      'X-Cohere-Api-Key': config.cohere || '' 
    }
  })

  return defineEventHandler(async (event) => {
    const body = await readBody(event)
    const base64 = body.data.split(',')[1];

    const myCollection = client.collections.use('PhoneGalleryTEST')

    const response = await myCollection.query.nearImage('public/images/00a0b916fd5941a3.jpg', { limit: 20 })

    return response.objects
    
  })

})