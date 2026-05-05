interface CustomerResponse {
  data?: {
    customer: {
      id: string
      firstName: string | null
      lastName: string | null
      emailAddress: { emailAddress: string } | null
    } | null
  }
  errors?: unknown[]
}

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'shopify_customer_access_token')
  if (!accessToken) return null

  const { apiUrl } = getCustomerAccountConfig()

  const query = `#graphql
    query Customer {
      customer {
        id
        firstName
        lastName
        emailAddress { emailAddress }
      }
    }
  `

  try {
    const response = await $fetch<CustomerResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: { query },
    })
    if (response.errors || !response.data?.customer) return null
    return response.data.customer
  } catch {
    return null
  }
})
