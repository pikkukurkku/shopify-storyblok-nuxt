<script setup>
defineProps({ blok: Object });
</script>

<template>
  <section v-editable="blok" class="text-center space-y-6">
    <h1 class="text-5xl font-bold tracking-tight">{{ blok.headline }}</h1>
    <NuxtImg
      v-if="blok.image?.filename"
      :src="blok.image.filename"
      :alt="blok.image.alt"
      width="400"
      height="200"
      sizes="sm:100vw md:800px"
      class="mx-auto rounded-2xl shadow-lg"
    />
  </section>
</template>
