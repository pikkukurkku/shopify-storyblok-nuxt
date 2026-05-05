// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@storyblok/nuxt", "@nuxt/image"],
  storyblok: {
    accessToken: process.env.STORYBLOK_TOKEN,
  },
  image: {
    provider: "storyblok",
    format: ["webp"],
    quality: 80,
    storyblok: {
      baseURL: "https://a.storyblok.com",
    },
  },
  runtimeConfig: {
    shopifyCustomerAccountClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    shopifyCustomerAccountApiUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
    shopifyCustomerAccountAuthUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL,
    shopifyCustomerAccountTokenUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL,
    shopifyCustomerAccountLogoutUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL,
    public: {
      shopifyDomain: process.env.SHOPIFY_DOMAIN,
      shopifyToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
      shopifyCountry: process.env.SHOPIFY_COUNTRY || 'DE',
    },
  },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      https: {
        key: "./.certs/key.pem",
        cert: "./.certs/cert.pem",
      },
    },
  },
  devServer: {
    https: {
      key: "./.certs/key.pem",
      cert: "./.certs/cert.pem",
    },
  },
});
