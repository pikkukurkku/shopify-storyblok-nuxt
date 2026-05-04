export function formatMoney(
  amount: string | number,
  currencyCode: string,
  locale = 'de-DE',
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(amount))
}
