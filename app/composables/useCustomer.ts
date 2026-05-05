export const useCustomer = () => {
  const headers = useRequestHeaders(['cookie'])
  const { data: customer, refresh } = useFetch('/api/auth/me', {
    key: 'customer',
    headers,
    default: () => null,
  })

  const isLoggedIn = computed(() => !!customer.value)

  return { customer, isLoggedIn, refresh }
}
