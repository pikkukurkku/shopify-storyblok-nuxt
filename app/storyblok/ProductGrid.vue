<script setup>
const props = defineProps({ blok: Object })

const items = computed(() => {
  const v = props.blok.products
  if (!v) return []
  if (Array.isArray(v)) return v
  if (Array.isArray(v.items)) return v.items
  return []
})
</script>

<template>
  <div v-editable="blok" class="grid gap-6 md:grid-cols-3">
    <ProductTeaser
      v-for="item in items"
      :key="item.id || item.handle"
      :handle="item.handle"
    />
  </div>
</template>
