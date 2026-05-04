<script setup>
defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok" class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
    <p class="text-lg font-medium">{{ blok.name }}</p>
  </div>
</template>
