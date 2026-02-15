import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderShippedTemplate(data: TemplateData): string {
  const template = `
    <h1 class="title">Your Order Has Shipped!</h1>

    <div class="content">
      <p class="text">Hi{{#customer_name}} <strong>{{customer_name}}</strong>{{/customer_name}},</p>
      <p class="text">
        Great news! Your order <strong>#{{order_number}}</strong> is on its way.
      </p>
    </div>

    {{#tracking_number}}
    <div style="margin: 24px 0; padding: 20px; background-color: ${colors.backgroundSecondary}; border-radius: 12px; border: 1px solid ${colors.border};">
      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Tracking Information</p>
      <p style="margin: 0; font-size: 14px; line-height: 22px; color: ${colors.primary};">
        Tracking Number: <strong>{{tracking_number}}</strong>
      </p>
    </div>
    {{/tracking_number}}

    {{#tracking_url}}
    <div class="button-container">
      <a href="{{tracking_url}}" class="button">Track Your Order &rarr;</a>
    </div>
    {{/tracking_url}}

    <p class="text" style="font-weight: 600; margin-top: 24px;">Items Shipped</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 8px 0 24px 0;">
      <thead>
        <tr style="border-bottom: 2px solid ${colors.border};">
          <th style="text-align: left; padding: 12px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Item</th>
          <th style="text-align: center; padding: 12px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Qty</th>
        </tr>
      </thead>
      <tbody>
        {{items_html}}
      </tbody>
    </table>

    <div class="disclaimer">
      <p class="disclaimer-text">
        Please allow a few days for tracking information to update. If you have any questions, feel free to reach out.
      </p>
    </div>
  `

  let result = template

  const conditionalFields = ["customer_name", "tracking_number", "tracking_url"]
  for (const field of conditionalFields) {
    const regex = new RegExp(`\\{\\{#${field}\\}\\}(.*?)\\{\\{\\/${field}\\}\\}`, "gs")
    if (data[field]) {
      result = result.replace(regex, "$1")
    } else {
      result = result.replace(regex, "")
    }
  }

  return interpolate(result, data)
}
