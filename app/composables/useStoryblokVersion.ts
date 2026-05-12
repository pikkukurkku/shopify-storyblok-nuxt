export function useStoryblokVersion(): 'draft' | 'published' {
  const route = useRoute()
  const inVisualEditor = '_storyblok' in route.query
  return import.meta.dev || inVisualEditor ? 'draft' : 'published'
}
