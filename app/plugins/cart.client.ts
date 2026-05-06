// .client suffix: only runs in the browser, so localStorage is safe to read.
export default defineNuxtPlugin(async () => {
  const { hydrate } = useCart()
  await hydrate()
})
