<script setup>
const shopify = useShopify();
const country = useShopifyCountry()

const { data: products } = await useAsyncData("products", async () => {
  const { data, errors } = await shopify.request(
    `#graphql
    query Products($country: CountryCode!) @inContext(country: $country) {   
      products(first: 12) {
        nodes {
          id
          handle
          title
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  `,
    {
      variables: { country },
    },
  );
  if (errors)
    throw createError({ statusCode: 500, statusMessage: "Shopify error" });
  return data.products.nodes;
});
</script>

<template>
  <main class="max-w-5xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">Products</h1>
    <div class="grid gap-6 md:grid-cols-3">
      <NuxtLink
        v-for="p in products"
        :key="p.id"
        :to="`/products/${p.handle}`"
        class="group block hover:opacity-80 transition"
      >
        <ProductImage
          :image="p.featuredImage"
          :title="p.title"
          class="aspect-square w-full"
        />
        <h3 class="mt-3 font-medium">{{ p.title }}</h3>
        <p class="mt-1 text-gray-600">
          {{ formatMoney(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode) }}
        </p>
      </NuxtLink>
    </div>
  </main>
</template>
