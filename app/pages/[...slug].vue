<script setup>
const route = useRoute()
const slug = (route.params.slug || []).join('/') || 'home'
const version = useStoryblokVersion()

const { story } = await useAsyncStoryblok(slug, {
  api: { version },
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
