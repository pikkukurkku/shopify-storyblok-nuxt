import type { H3Event } from 'h3'

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  id_token?: string
  token_type: string
}

interface GraphQLResponse<T> {
  data?: T
  errors?: unknown[]
}

const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const clearAuthCookies = (event: H3Event) => {
  deleteCookie(event, 'shopify_customer_access_token')
  deleteCookie(event, 'shopify_customer_refresh_token')
  deleteCookie(event, 'shopify_customer_id_token')
}

const refreshAccessToken = async (event: H3Event): Promise<string | null> => {
  const refreshToken = getCookie(event, 'shopify_customer_refresh_token')
  if (!refreshToken) return null

  const { clientId, tokenUrl } = getCustomerAccountConfig()
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  })

  try {
    const tokens = await $fetch<TokenResponse>(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    setCookie(event, 'shopify_customer_access_token', tokens.access_token, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: tokens.expires_in,
    })
    if (tokens.refresh_token) {
      setCookie(event, 'shopify_customer_refresh_token', tokens.refresh_token, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: REFRESH_COOKIE_MAX_AGE,
      })
    }
    return tokens.access_token
  } catch {
    // Refresh failed (revoked, expired, etc.) — force re-auth
    clearAuthCookies(event)
    return null
  }
}

export const customerGraphQL = async <T>(
  event: H3Event,
  query: string,
): Promise<GraphQLResponse<T> | null> => {
  const { apiUrl } = getCustomerAccountConfig()

  let accessToken = getCookie(event, 'shopify_customer_access_token') ?? null
  if (!accessToken) {
    accessToken = await refreshAccessToken(event)
    if (!accessToken) return null
  }

  const fetchWithToken = (token: string) =>
    $fetch<GraphQLResponse<T>>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: { query },
    })

  try {
    return await fetchWithToken(accessToken)
  } catch (err: unknown) {
    const status =
      (err as { statusCode?: number; status?: number })?.statusCode ??
      (err as { statusCode?: number; status?: number })?.status
    if (status !== 401) return null

    const refreshed = await refreshAccessToken(event)
    if (!refreshed) return null

    try {
      return await fetchWithToken(refreshed)
    } catch {
      return null
    }
  }
}
