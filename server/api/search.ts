import weaviate, { WeaviateClient } from "weaviate-client"
import { z } from 'zod'

const responseSchema = z.object({
  query: z.string(),
})

export default defineLazyEventHandler(async () => {
  const config = useRuntimeConfig()

  const client: WeaviateClient = await weaviate.connectToLocal({
      headers: {
        'X-Cohere-Api-Key': config.cohere || '' 
      }
    }
  )

const responseSchema = z.object({
  query: z.string(),
})


async function vectorSearch(searchTerm:string) {
const myCollection = client.collections.use('PhoneGalleryTEST')

const response = await myCollection.query.nearImage('public/images/000ada55d36b4bcb.jpg', { limit: 1 })

console.log("img search results", response.objects)
return response.objects
}

  return defineEventHandler<{query: { query: string } }>(async (event) => {
  
    const result = await getValidatedQuery(event, body => responseSchema.safeParse(body))
    if (!result.success)
      throw result.error.issues
  
    const searchTerm = result.data.query
  
    return await vectorSearch(searchTerm)
  })
})