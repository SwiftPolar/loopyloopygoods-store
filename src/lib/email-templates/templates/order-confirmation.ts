import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderConfirmationTemplate(data: TemplateData): string {
  const template = `
    <h1 class="title">Order Confirmed!</h1>

    <div class="content">
      <p class="text">Hi{{#customer_name}} <strong>{{customer_name}}</strong>{{/customer_name}},</p>
      <p class="text">
        Thank you for your order! We've received your order <strong>#{{order_number}}</strong> and are getting it ready.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 24px 0;">
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

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 0 0 24px 0;">
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: ${colors.muted};">Subtotal</td>
        <td style="padding: 8px 0; font-size: 14px; color: ${colors.primary}; text-align: right;">{{subtotal}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: ${colors.muted};">Shipping</td>
        <td style="padding: 8px 0; font-size: 14px; color: ${colors.primary}; text-align: right;">{{shipping_total}}</td>
      </tr>
      <tr style="border-top: 2px solid ${colors.border};">
        <td style="padding: 12px 0; font-size: 16px; font-weight: 700; color: ${colors.primary};">Total</td>
        <td style="padding: 12px 0; font-size: 16px; font-weight: 700; color: ${colors.primary}; text-align: right;">{{total}}</td>
      </tr>
    </table>

    {{#shipping_name}}
    <div style="margin: 24px 0; padding: 20px; background-color: ${colors.backgroundSecondary}; border-radius: 12px; border: 1px solid ${colors.border};">
      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: ${colors.muted};">Shipping To</p>
      <p style="margin: 0; font-size: 14px; line-height: 22px; color: ${colors.primary};">
        {{shipping_name}}<br/>
        {{shipping_address}}
      </p>
    </div>
    {{/shipping_name}}

    <div class="disclaimer">
      <p class="disclaimer-text">
        If you have any questions about your order, please don't hesitate to reach out to us.
      </p>
    </div>
  `

  let result = template

  // Handle conditional customer name
  if (data.customer_name) {
    result = result.replace(/\{\{#customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
  } else {
    result = result.replace(/\{\{#customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
  }

  // Handle conditional shipping name block
  if (data.shipping_name) {
    result = result.replace(/\{\{#shipping_name\}\}(.*?)\{\{\/shipping_name\}\}/gs, "$1")
  } else {
    result = result.replace(/\{\{#shipping_name\}\}.*?\{\{\/shipping_name\}\}/gs, "")
  }

  return interpolate(result, data)
}
