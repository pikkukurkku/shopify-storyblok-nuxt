export default defineEventHandler(async (event) => {
  const { logoutUrl } = getCustomerAccountConfig()
  const idToken = getCookie(event, 'shopify_customer_id_token')

  deleteCookie(event, 'shopify_customer_access_token')
  deleteCookie(event, 'shopify_customer_refresh_token')
  deleteCookie(event, 'shopify_customer_id_token')

  const origin = getRequestURL(event).origin
  const params = new URLSearchParams({ post_logout_redirect_uri: `${origin}/` })
  if (idToken) params.set('id_token_hint', idToken)

  await sendRedirect(event, `${logoutUrl}?${params.toString()}`, 302)
})
