// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      username_DB: import.meta.env.USERNAME,
      password_DB: import.meta.env.PASSWORD,
      host_DB: import.meta.env.HOST,
      database_Name: import.meta.env.DATABASE,
      username_Redis: import.meta.env.USERNAME_REDIS,
      password_Redis: import.meta.env.PASSWORD_REDIS,
      host_Redis: import.meta.env.HOST_REDIS,
      port_Redis: import.meta.env.PORT,
      jwt_Secret_Key: import.meta.env.JWT_SECRET_KEY,
      supabase_URL: import.meta.env.SUPABASE_URL,
      supabase_Key: import.meta.env.SUPABASE_KEY
    }
  },

  vite: {
    server: {
      allowedHosts: ['nonsympathizing-gyrostatically-muoi.ngrok-free.dev']
    }
  },

  routeRules: {
    "/profile":{
      ssr: true
    }
  },

  modules: ['nuxt-toastify']
})