<script setup>
const props = defineProps({
  handle: { type: String, required: true },
})

const shopify = useShopify()

const { data: product } = await useAsyncData(`teaser-${props.handle}`, async () => {
  const { data, errors } = await shopify.request(`#graphql
    query TeaserProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  `, { variables: { handle: props.handle } })
  if (errors) return null
  return data.product
})
</script>

<template>
  <NuxtLink
    v-if="product"
    :to="`/products/${product.handle}`"
    class="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
  >
    <img
      v-if="product.featuredImage"
      :src="product.featuredImage.url"
      :alt="product.featuredImage.altText || product.title"
      class="w-full aspect-square object-cover group-hover:scale-105 transition"
    />
    <div class="p-4 space-y-1">
      <h3 class="font-medium">{{ product.title }}</h3>
      <p class="text-sm text-gray-600">
        {{ product.priceRange.minVariantPrice.amount }}
        {{ product.priceRange.minVariantPrice.currencyCode }}
      </p>
    </div>
  </NuxtLink>
</template>
