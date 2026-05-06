type Money = { amount: string; currencyCode: string }

type CartLine = {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: {
    id: string
    title: string
    image: { url: string; altText: string | null } | null
    product: { title: string; handle: string }
    price: Money
  }
}

type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: CartLine[]
  cost: { subtotalAmount: Money; totalAmount: Money }
}

const CART_FIELDS = `#graphql
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            product { title handle }
            price { amount currencyCode }
          }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`

const STORAGE_KEY = 'shopify-cart-id'

const flatten = (raw: any): Cart | null =>
  raw ? { ...raw, lines: raw.lines?.nodes ?? [] } : null

export const useCart = () => {
  const shopify = useShopify()
  const country = useShopifyCountry()
  // useState (not ref) so every component sees the same reactive cart across SSR + client.
  const cart = useState<Cart | null>('cart', () => null)
  const isLoading = useState<boolean>('cart-loading', () => false)
  const lineCount = computed(() => cart.value?.totalQuantity ?? 0)

  const persistId = (id: string | null) => {
    if (!import.meta.client) return
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  }

  const apply = (data: any, op: string) => {
    const result = data?.[op]
    const errs = result?.userErrors ?? []
    if (errs.length) throw createError({ statusCode: 400, statusMessage: errs[0].message })
    cart.value = flatten(result?.cart)
    persistId(cart.value?.id ?? null)
  }

  const hydrate = async () => {
    if (!import.meta.client) return
    const id = localStorage.getItem(STORAGE_KEY)
    if (!id) return
    isLoading.value = true
    try {
      const { data } = await shopify.request(`#graphql
        query Cart($id: ID!, $country: CountryCode!) @inContext(country: $country) {
          cart(id: $id) { ...CartFields }
        }
        ${CART_FIELDS}
      `, { variables: { id, country } })
      // Cart can expire / get completed at checkout — clear the id if Shopify says it's gone.
      if (!data?.cart) {
        persistId(null)
        cart.value = null
      } else {
        cart.value = flatten(data.cart)
      }
    } finally {
      isLoading.value = false
    }
  }

  const addItem = async (variantId: string, quantity = 1) => {
    isLoading.value = true
    try {
      if (!cart.value?.id) {
        const { data, errors } = await shopify.request(`#graphql
          mutation CartCreate($input: CartInput!, $country: CountryCode!) @inContext(country: $country) {
            cartCreate(input: $input) {
              cart { ...CartFields }
              userErrors { field message }
            }
          }
          ${CART_FIELDS}
        `, {
          variables: {
            input: {
              lines: [{ merchandiseId: variantId, quantity }],
              buyerIdentity: { countryCode: country },
            },
            country,
          },
        })
        if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
        apply(data, 'cartCreate')
      } else {
        const { data, errors } = await shopify.request(`#graphql
          mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode!) @inContext(country: $country) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart { ...CartFields }
              userErrors { field message }
            }
          }
          ${CART_FIELDS}
        `, {
          variables: {
            cartId: cart.value.id,
            lines: [{ merchandiseId: variantId, quantity }],
            country,
          },
        })
        if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
        apply(data, 'cartLinesAdd')
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateLine = async (lineId: string, quantity: number) => {
    if (!cart.value?.id) return
    if (quantity <= 0) return removeLine(lineId)
    isLoading.value = true
    try {
      const { data, errors } = await shopify.request(`#graphql
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode!) @inContext(country: $country) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart { ...CartFields }
            userErrors { field message }
          }
        }
        ${CART_FIELDS}
      `, {
        variables: { cartId: cart.value.id, lines: [{ id: lineId, quantity }], country },
      })
      if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
      apply(data, 'cartLinesUpdate')
    } finally {
      isLoading.value = false
    }
  }

  const removeLine = async (lineId: string) => {
    if (!cart.value?.id) return
    isLoading.value = true
    try {
      const { data, errors } = await shopify.request(`#graphql
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode!) @inContext(country: $country) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart { ...CartFields }
            userErrors { field message }
          }
        }
        ${CART_FIELDS}
      `, {
        variables: { cartId: cart.value.id, lineIds: [lineId], country },
      })
      if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
      apply(data, 'cartLinesRemove')
    } finally {
      isLoading.value = false
    }
  }

  const goToCheckout = () => {
    if (cart.value?.checkoutUrl) window.location.href = cart.value.checkoutUrl
  }

  // Fast-path: skip the persistent cart and go straight to checkout for a single item.
  const buyNow = async (variantId: string, quantity = 1) => {
    const { data, errors } = await shopify.request(`#graphql
      mutation CartCreate($input: CartInput!, $country: CountryCode!) @inContext(country: $country) {
        cartCreate(input: $input) {
          cart { id checkoutUrl }
          userErrors { field message }
        }
      }
    `, {
      variables: {
        input: {
          lines: [{ merchandiseId: variantId, quantity }],
          buyerIdentity: { countryCode: country },
        },
        country,
      },
    })
    if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
    const userErrors = data?.cartCreate?.userErrors ?? []
    if (userErrors.length) throw createError({ statusCode: 400, statusMessage: userErrors[0].message })
    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl
    if (!checkoutUrl) throw createError({ statusCode: 500, statusMessage: 'No checkout URL returned' })
    window.location.href = checkoutUrl
  }

  return { cart, lineCount, isLoading, hydrate, addItem, updateLine, removeLine, goToCheckout, buyNow }
}
