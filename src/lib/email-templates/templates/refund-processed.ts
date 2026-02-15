import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function refundProcessedTemplate(data: TemplateData): string {
  const template = `
    <h1 class="title">Refund Processed</h1>

    <div class="content">
      <p class="text">Hi{{#customer_name}} <strong>{{customer_name}}</strong>{{/customer_name}},</p>
      <p class="text">
        A refund of <strong>{{refund_amount}}</strong> has been processed for your order <strong>#{{order_number}}</strong>.
      </p>
    </div>

    <div style="margin: 24px 0; padding: 20px; background-color: ${colors.backgroundSecondary}; border-radius: 12px; border: 1px solid ${colors.border};">
      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Refund Details</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; font-size: 14px; color: ${colors.muted};">Order</td>
          <td style="padding: 4px 0; font-size: 14px; color: ${colors.primary}; text-align: right;">#{{order_number}}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 14px; color: ${colors.muted};">Refund Amount</td>
          <td style="padding: 4px 0; font-size: 14px; font-weight: 700; color: ${colors.primary}; text-align: right;">{{refund_amount}}</td>
        </tr>
      </table>
    </div>

    <p class="text">
      The refund should appear in your account within 5&ndash;10 business days, depending on your payment provider.
    </p>

    <div class="disclaimer">
      <p class="disclaimer-text">
        If you have any questions about this refund, please don't hesitate to contact us.
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
