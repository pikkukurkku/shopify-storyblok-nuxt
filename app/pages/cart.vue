<script setup>
const { cart, isLoading, updateLine, removeLine, goToCheckout } = useCart()
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Your cart</h1>

    <div v-if="!cart || cart.lines.length === 0" class="text-center py-16 space-y-4">
      <p class="text-gray-600">Your cart is empty.</p>
      <NuxtLink to="/products" class="inline-block rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition">
        Browse products
      </NuxtLink>
    </div>

    <div v-else class="space-y-8">
      <ul class="divide-y border-t border-b">
        <li
          v-for="line in cart.lines"
          :key="line.id"
          class="flex gap-4 py-4 items-center"
        >
          <NuxtLink :to="`/products/${line.merchandise.product.handle}`" class="shrink-0">
            <img
              v-if="line.merchandise.image"
              :src="line.merchandise.image.url"
              :alt="line.merchandise.image.altText || line.merchandise.product.title"
              class="w-20 h-20 object-cover rounded-lg"
            />
          </NuxtLink>
          <div class="flex-1 min-w-0">
            <NuxtLink :to="`/products/${line.merchandise.product.handle}`" class="font-medium hover:underline">
              {{ line.merchandise.product.title }}
            </NuxtLink>
            <p class="text-sm text-gray-600">
              {{ formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode) }}
            </p>
            <button
              type="button"
              class="text-sm text-gray-500 underline hover:text-black mt-1 disabled:opacity-50"
              :disabled="isLoading"
              @click="removeLine(line.id)"
            >
              Remove
            </button>
          </div>
          <div class="inline-flex items-center border rounded-full overflow-hidden">
            <button
              type="button"
              class="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
              :disabled="isLoading || line.quantity <= 1"
              @click="updateLine(line.id, line.quantity - 1)"
            >−</button>
            <span class="px-3 min-w-8 text-center">{{ line.quantity }}</span>
            <button
              type="button"
              class="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
              :disabled="isLoading"
              @click="updateLine(line.id, line.quantity + 1)"
            >+</button>
          </div>
          <p class="w-24 text-right font-medium">
            {{ formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode) }}
          </p>
        </li>
      </ul>

      <div class="flex justify-between items-baseline text-lg">
        <span class="font-medium">Subtotal</span>
        <span class="font-bold">
          {{ formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode) }}
        </span>
      </div>
      <p class="text-sm text-gray-500 -mt-6">Shipping and taxes are calculated at checkout.</p>

      <button
        type="button"
        class="w-full rounded-full bg-black text-white py-3 font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        :disabled="isLoading"
        @click="goToCheckout"
      >
        Checkout
      </button>
    </div>
  </main>
</template>
