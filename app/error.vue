<script setup>
defineProps({
  error: Object,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-24 text-center">
    <h1 class="text-6xl font-bold mb-4">{{ error.statusCode }}</h1>
    <p class="text-xl text-gray-600 mb-8">
      {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
    </p>
    <button
      @click="handleError"
      class="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
    >
      Back to home
    </button>
  </main>
</template>
