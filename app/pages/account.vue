<script setup>
const { customer, isLoggedIn } = useCustomer()
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">My Account</h1>

    <div v-if="isLoggedIn" class="space-y-2">
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
        class="inline-block mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
      >
        Log out
      </a>
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
