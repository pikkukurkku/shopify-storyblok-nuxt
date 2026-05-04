import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export const useShopify = () => {
  const config = useRuntimeConfig()
  return createStorefrontApiClient({
    storeDomain: `https://${config.public.shopifyDomain}`,
    apiVersion: '2026-04',
    publicAccessToken: config.public.shopifyToken as string,
  })
}
