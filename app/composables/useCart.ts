export const useCart = () => {
  const shopify = useShopify()

  const buyNow = async (variantId: string, quantity = 1) => {
    const { data, errors } = await shopify.request(`#graphql
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    })

    if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })

    const userErrors = data?.cartCreate?.userErrors ?? []
    if (userErrors.length) {
      throw createError({ statusCode: 400, statusMessage: userErrors[0].message })
    }

    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl
    if (!checkoutUrl) throw createError({ statusCode: 500, statusMessage: 'No checkout URL returned' })

    window.location.href = checkoutUrl
  }

  return { buyNow }
}
