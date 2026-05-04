<script setup>
import { ref } from 'vue'
defineProps({ blok: Object })

const scrollContainer = ref(null)

function step() {
  const el = scrollContainer.value
  if (!el) return 0
  const firstCard = el.firstElementChild
  if (!firstCard) return 0
  const styles = getComputedStyle(el)
  const gap = parseFloat(styles.columnGap || styles.gap || '0')
  return firstCard.getBoundingClientRect().width + gap
}

const CARDS_PER_PAGE = 3

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -step() * CARDS_PER_PAGE, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: step() * CARDS_PER_PAGE, behavior: 'smooth' })
}

</script>

<template>
  <section v-editable="blok" class="space-y-6">
    <h2
      v-if="blok.headline"
      class="text-3xl font-semibold text-gray-700 text-center"
    >
      {{ blok.headline }}
    </h2>

    <div class="relative">
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow p-2"
      >
        ‹
      </button>

      <!-- Scroll container -->
      <div
        ref="scrollContainer"
        class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8"
      >
        <div
          v-for="column in blok.columns"
          :key="column._uid"
          class="snap-start shrink-0 w-72 md:w-80"
        >
          <StoryblokComponent :blok="column" />
        </div>
      </div>

      <!-- Right button -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow p-2"
      >
        ›
      </button>
    </div>
  </section>
</template>
