<script setup>
const route = useRoute()
const slug = (route.params.slug || []).join('/') || 'home'

const { story } = await useAsyncStoryblok(slug, {
  api: { version: 'draft' },
})

if (!story.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}
</script>

<template>
  <StoryblokComponent :blok="story.content" />
</template>
