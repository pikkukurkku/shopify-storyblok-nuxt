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

interface OrdersData {
  customer: {
    orders: { nodes: Order[] }
  } | null
}

export default defineEventHandler(async (event) => {
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

  const response = await customerGraphQL<OrdersData>(event, query)
  if (!response || response.errors || !response.data?.customer) return { orders: [] }
  return { orders: response.data.customer.orders.nodes }
})
