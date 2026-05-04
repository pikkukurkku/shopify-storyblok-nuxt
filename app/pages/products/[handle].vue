<script setup>
const route = useRoute()
const shopify = useShopify()
const country = useShopifyCountry()
const { buyNow } = useCart()

const { data: product } = await useAsyncData(`product-${route.params.handle}`, async () => {
  const { data, errors } = await shopify.request(`#graphql
    query Product($handle: String!, $country: CountryCode!) @inContext(country: $country) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) {
          nodes {
            id
            availableForSale
          }
        }
      }
    }
  `, {
    variables: { handle: route.params.handle, country },
  })
  if (errors) throw createError({ statusCode: 500, statusMessage: 'Shopify error' })
  if (!data.product) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
  return data.product
})

const { data: related } = await useAsyncData(                                                                                                                                                                                                                                          
    `related-${route.params.handle}`,                                                                                                                                                                                                                                                    
    async () => {
      const { data, errors } = await shopify.request(`#graphql
        query Related($productId: ID!) {                                                                                                                                                                                                                                                 
          productRecommendations(productId: $productId) {
            handle                                                                                                                                                                                                                                                                       
          }       
        }
      `, { variables: { productId: product.value.id } })
      if (errors) return []                                                                                                                                                                                                                                                              
      return (data.productRecommendations || []).slice(0, 3)
    }                                                                                                                                                                                                                                                                                    
  )

const variant = computed(() => product.value?.variants?.nodes?.[0])
const isBuying = ref(false)

async function onBuyNow() {
  if (!variant.value) return
  isBuying.value = true
  try {
    await buyNow(variant.value.id)
  } finally {
    isBuying.value = false
  }
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <article v-if="product" class="grid gap-10 md:grid-cols-2">
      <img
        v-if="product.featuredImage"
        :src="product.featuredImage.url"
        :alt="product.featuredImage.altText || product.title"
        class="w-full aspect-square object-cover rounded-2xl"
      />
      <div class="space-y-6">
        <h1 class="text-4xl font-bold">{{ product.title }}</h1>
        <p class="text-2xl">
          {{ formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode) }}
        </p>
        <button
          type="button"
          class="w-full rounded-full bg-black text-white py-3 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          :disabled="!variant?.availableForSale || isBuying"
          @click="onBuyNow"
        >
          {{ isBuying
            ? 'Redirecting…'
            : variant?.availableForSale
              ? 'Buy now'
              : 'Sold out' }}
        </button>
        <div class="prose" v-html="product.descriptionHtml" />
      </div>
    </article>
      <section v-if="related?.length" class="mt-16">                                                                                                                                                                                                                                         
    <h2 class="text-2xl font-bold mb-6">You might also like(fetched from Shopify and uses Shopify logic)</h2>                                                                                                                                                                                                                         
    <div class="grid gap-6 md:grid-cols-3">
      <ProductTeaser                                                                                                                                                                                                                                                                     
        v-for="r in related"                                                                                                                                                                                                                                                             
        :key="r.handle"
        :handle="r.handle"                                                                                                                                                                                                                                                               
      />          
    </div>
  </section>
  </main>
</template>
