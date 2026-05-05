import type { H3Event } from 'h3'

export const getCustomerAccountConfig = () => {
  const config = useRuntimeConfig()
  const clientId = config.shopifyCustomerAccountClientId as string
  const apiUrl = config.shopifyCustomerAccountApiUrl as string
  const authUrl = config.shopifyCustomerAccountAuthUrl as string
  const tokenUrl = config.shopifyCustomerAccountTokenUrl as string
  const logoutUrl = config.shopifyCustomerAccountLogoutUrl as string

  if (!clientId || !apiUrl || !authUrl || !tokenUrl || !logoutUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Customer Account API env vars are not fully configured',
    })
  }

  return { clientId, apiUrl, authUrl, tokenUrl, logoutUrl }
}

export const getRedirectUri = (event: H3Event) => {
  const url = getRequestURL(event)
  return `${url.origin}/api/auth/callback`
}

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
}
