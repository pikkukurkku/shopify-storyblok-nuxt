interface CustomerData {
  customer: {
    id: string
    firstName: string | null
    lastName: string | null
    emailAddress: { emailAddress: string } | null
  } | null
}

export default defineEventHandler(async (event) => {
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

  const response = await customerGraphQL<CustomerData>(event, query)
  if (!response || response.errors || !response.data?.customer) return null
  return response.data.customer
})
