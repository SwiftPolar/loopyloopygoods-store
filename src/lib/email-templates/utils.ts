export type TemplateData = Record<string, string | number | boolean | undefined>

/**
 * Simple template variable interpolation
 * Replaces {{variable}} with the corresponding value from data
 */
export function interpolate(template: string, data: TemplateData): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key]
    return value !== undefined ? String(value) : match
  })
}

/**
 * Formats a currency amount from the smallest unit (e.g. cents) to a display string.
 * Medusa stores amounts as integers in the smallest currency unit.
 */
export function formatCurrency(amount: number, currencyCode: string = "usd"): string {
  const divisor = 100
  const value = amount / divisor

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(value)
}
