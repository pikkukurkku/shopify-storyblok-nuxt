interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  id_token?: string
  token_type: string
}

export default defineEventHandler(async (event) => {
  const { clientId, tokenUrl } = getCustomerAccountConfig()
  const query = getQuery(event)
  const code = query.code as string | undefined
  const returnedState = query.state as string | undefined
  const oauthError = query.error as string | undefined

  if (oauthError) {
    throw createError({
      statusCode: 400,
      statusMessage: `OAuth error: ${oauthError} ${query.error_description ?? ''}`,
    })
  }

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Missing authorization code' })
  }

  const storedState = getCookie(event, 'shopify_oauth_state')
  const verifier = getCookie(event, 'shopify_pkce_verifier')

  if (!storedState || storedState !== returnedState) {
    throw createError({ statusCode: 400, statusMessage: 'State mismatch (CSRF check failed)' })
  }
  if (!verifier) {
    throw createError({ statusCode: 400, statusMessage: 'PKCE verifier missing' })
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: getRedirectUri(event),
    code,
    code_verifier: verifier,
  })

  const tokens = await $fetch<TokenResponse>(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  setCookie(event, 'shopify_customer_access_token', tokens.access_token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: tokens.expires_in,
  })
  setCookie(event, 'shopify_customer_refresh_token', tokens.refresh_token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30,
  })
  if (tokens.id_token) {
    setCookie(event, 'shopify_customer_id_token', tokens.id_token, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  deleteCookie(event, 'shopify_pkce_verifier')
  deleteCookie(event, 'shopify_oauth_state')
  deleteCookie(event, 'shopify_oauth_nonce')

  await sendRedirect(event, '/account', 302)
})
