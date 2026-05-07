<script setup>
const route = useRoute()
const shopify = useShopify()
const country = useShopifyCountry()
const { buyNow, addItem } = useCart()

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

let template
try {
  const { story } = await useAsyncStoryblok('templates/product', {
    api: { version: 'draft' },
    bridge: {},
  })
  template = story
} catch {
  template = ref(null)
}

const variant = computed(() => product.value?.variants?.nodes?.[0])
const quantity = ref(1)
const isBuying = ref(false)
const isAdding = ref(false)
const justAdded = ref(false)

async function onBuyNow() {
  if (!variant.value) return
  isBuying.value = true
  try {
    await buyNow(variant.value.id, quantity.value)
  } finally {
    isBuying.value = false
  }
}

async function onAddToCart() {
  if (!variant.value) return
  isAdding.value = true
  try {
    await addItem(variant.value.id, quantity.value)
    justAdded.value = true
    setTimeout(() => (justAdded.value = false), 1500)
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <section v-if="template?.content.aboveBuyBox?.length" class="bg-red-300 text-center rounded-xl py-8 mb-18 space-y-8">
    <StoryblokComponent
      v-for="blok in template.content.aboveBuyBox"
      :key="blok._uid"
      :blok="blok"
    />
  </section>

    <article v-if="product" class="grid gap-10 md:grid-cols-2">
      <ProductImage
        :image="product.featuredImage"
        :title="product.title"
        :icon-size="80"
        class="w-full aspect-square rounded-2xl"
      />
      <div class="space-y-6">
        <h1 class="text-4xl font-bold">{{ product.title }}</h1>
        <p class="text-2xl">
          {{ formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode) }}
        </p>
        <div v-if="variant?.availableForSale" class="flex items-center gap-3">
          <span class="text-sm text-gray-700">Quantity</span>
          <div class="inline-flex items-center border rounded-full overflow-hidden">
            <button
              type="button"
              class="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
              :disabled="quantity <= 1"
              @click="quantity = Math.max(1, quantity - 1)"
            >−</button>
            <span class="px-4 min-w-8 text-center">{{ quantity }}</span>
            <button
              type="button"
              class="px-3 py-1 hover:bg-gray-100"
              @click="quantity = quantity + 1"
            >+</button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-full border border-black py-3 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="!variant?.availableForSale || isAdding"
            @click="onAddToCart"
          >
            {{ isAdding ? 'Adding…' : justAdded ? 'Added ✓' : 'Add to cart' }}
          </button>
          <button
            type="button"
            class="rounded-full bg-black text-white py-3 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="!variant?.availableForSale || isBuying"
            @click="onBuyNow"
          >
            {{ isBuying
              ? 'Redirecting…'
              : variant?.availableForSale
                ? 'Buy now'
                : 'Sold out' }}
          </button>
        </div>
        <div class="prose" v-html="product.descriptionHtml" />
      </div>
    </article>
          <section v-if="template?.content.belowBuyBox?.length" class="bg-blue-300 text-center rounded-xl py-8 my-18 space-y-8">
    <StoryblokComponent
      v-for="blok in template.content.belowBuyBox"
      :key="blok._uid"
      :blok="blok"
    />
  </section>
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
