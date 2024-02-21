// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],
    runtimeConfig: {
      public: {
         openai: process.env.NUXT_OPENAI_API_KEY || '',
        },
      },
    },
)
