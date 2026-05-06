interface OrderLineItem {
  title: string
  quantity: number
  variantTitle: string | null
  image: { url: string; altText: string | null } | null
  totalPrice: { amount: string; currencyCode: string }
}

interface Order {
  id: string
  name: string
  processedAt: string
  financialStatus: string | null
  totalPrice: { amount: string; currencyCode: string }
  lineItems: { nodes: OrderLineItem[] }
}

interface OrdersResponse {
  data?: {
    customer: {
      orders: { nodes: Order[] }
    } | null
  }
  errors?: unknown[]
}

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'shopify_customer_access_token')
  if (!accessToken) return { orders: [] }

  const { apiUrl } = getCustomerAccountConfig()

  const query = `#graphql
    query CustomerOrders {
      customer {
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            name
            processedAt
            financialStatus
            totalPrice { amount currencyCode }
            lineItems(first: 5) {
              nodes {
                title
                quantity
                variantTitle
                image { url altText }
                totalPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await $fetch<OrdersResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: { query },
    })
    if (response.errors || !response.data?.customer) return { orders: [] }
    return { orders: response.data.customer.orders.nodes }
  } catch {
    return { orders: [] }
  }
})
