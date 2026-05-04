<script setup>
defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <ProductTeaser v-if="blok.handle" :handle="blok.handle" />
  </div>
</template>
