export default defineEventHandler(async (event) => {
  const { clientId, authUrl } = getCustomerAccountConfig()

  const verifier = generateRandomString(64)
  const challenge = generateCodeChallenge(verifier)
  const state = generateRandomString(32)
  const nonce = generateRandomString(32)

  const shortLived = { ...AUTH_COOKIE_OPTIONS, maxAge: 60 * 10 }
  setCookie(event, 'shopify_pkce_verifier', verifier, shortLived)
  setCookie(event, 'shopify_oauth_state', state, shortLived)
  setCookie(event, 'shopify_oauth_nonce', nonce, shortLived)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: getRedirectUri(event),
    scope: 'openid email customer-account-api:full',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })

  await sendRedirect(event, `${authUrl}?${params.toString()}`, 302)
})
