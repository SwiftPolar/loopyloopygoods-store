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
