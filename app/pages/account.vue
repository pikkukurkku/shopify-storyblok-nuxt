<script setup>
const { customer, isLoggedIn } = useCustomer()

const headers = useRequestHeaders(['cookie'])
const { data: orderData } = await useFetch('/api/auth/orders', {
  key: 'customer-orders',
  headers,
  default: () => ({ orders: [] }),
})
const orders = computed(() => orderData.value?.orders ?? [])

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">My Account</h1>

    <div v-if="isLoggedIn" class="space-y-10">
      <section class="space-y-2">
        <p>
          <span class="text-gray-600">Name:</span>
          {{ customer.firstName }} {{ customer.lastName }}
        </p>
        <p>
          <span class="text-gray-600">Email:</span>
          {{ customer.emailAddress?.emailAddress }}
        </p>
        <a
          href="/api/auth/logout"
          class="inline-block mt-4 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          Log out
        </a>
      </section>

      <section>
        <h2 class="text-2xl font-bold mb-4">Order history</h2>

        <p v-if="orders.length === 0" class="text-gray-600">
          You haven't placed any orders yet.
        </p>

        <ul v-else class="space-y-6">
          <li
            v-for="order in orders"
            :key="order.id"
            class="border rounded-2xl p-5 space-y-3"
          >
            <header class="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p class="font-semibold">{{ order.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(order.processedAt) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">
                  {{ formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode) }}
                </p>
                <p v-if="order.financialStatus" class="text-xs uppercase tracking-wide text-gray-500">
                  {{ order.financialStatus }}
                </p>
              </div>
            </header>

            <ul class="divide-y">
              <li
                v-for="(item, idx) in order.lineItems.nodes"
                :key="idx"
                class="flex gap-3 py-2 items-center"
              >
                <ProductImage
                  :image="item.image"
                  :title="item.title"
                  :icon-size="20"
                  class="w-12 h-12 rounded"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ item.title }}</p>
                  <p v-if="item.variantTitle" class="text-xs text-gray-500">
                    {{ item.variantTitle }}
                  </p>
                </div>
                <p class="text-sm text-gray-600">× {{ item.quantity }}</p>
                <p class="text-sm w-20 text-right">
                  {{ formatMoney(item.totalPrice.amount, item.totalPrice.currencyCode) }}
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="space-y-4">
      <p class="text-gray-600">You're not logged in.</p>
      <a
        href="/api/auth/login"
        class="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
      >
        Log in
      </a>
    </div>
  </main>
</template>
