import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderCancelledTemplate(data: TemplateData): string {
  const template = `
    <h1 class="title">Order Cancelled</h1>

    <div class="content">
      <p class="text">Hi{{#customer_name}} <strong>{{customer_name}}</strong>{{/customer_name}},</p>
      <p class="text">
        Your order <strong>#{{order_number}}</strong> has been cancelled. If a payment was made, a refund will be processed shortly.
      </p>
    </div>

    <p class="text" style="font-weight: 600; margin-top: 24px;">Cancelled Items</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 8px 0 24px 0;">
      <thead>
        <tr style="border-bottom: 2px solid ${colors.border};">
          <th style="text-align: left; padding: 12px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Item</th>
          <th style="text-align: center; padding: 12px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Qty</th>
          <th style="text-align: right; padding: 12px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Price</th>
        </tr>
      </thead>
      <tbody>
        {{items_html}}
      </tbody>
    </table>

    <div class="disclaimer">
      <p class="disclaimer-text">
        If you didn't request this cancellation or have any questions, please contact us and we'll be happy to help.
      </p>
    </div>
  `

  let result = template

  if (data.customer_name) {
    result = result.replace(/\{\{#customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
  } else {
    result = result.replace(/\{\{#customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
  }

  return interpolate(result, data)
}
