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
 * Formats a currency amount to a display string.
 * Medusa v2 stores amounts in standard currency units (e.g. 24.00, not 2400).
 */
export function formatCurrency(amount: number, currencyCode: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}
