<script setup>
defineProps({
  image: { type: Object, default: null },
  title: { type: String, default: '' },
  iconSize: { type: Number, default: 48 },
})

const errored = ref(false)
</script>

<template>
  <div class="overflow-hidden">
    <img
      v-if="image?.url && !errored"
      :src="image.url"
      :alt="image.altText || title"
      class="w-full h-full object-cover"
      @error="errored = true"
    />
    <div
      v-else
      class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400"
      role="img"
      :aria-label="`No image available for ${title}`"
    >
      <svg xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
        <line x1="13.5" y1="13.5" x2="6" y2="21" />
        <line x1="18" y1="12" x2="21" y2="9" />
        <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" />
        <path d="M21 15V5a2 2 0 0 0-2-2H9" />
      </svg>
    </div>
  </div>
</template>
