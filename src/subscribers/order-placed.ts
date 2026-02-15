import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate, formatCurrency } from "../lib/email-templates"
import { colors } from "../lib/email-templates/colors"

type OrderPlacedData = {
  id: string
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedData>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "*",
      "items.*",
      "shipping_address.*",
      "customer.*",
      "shipping_methods.*",
    ],
    filters: { id: data.id },
  })

  if (!order) return

  const email = order.email || order.customer?.email
  if (!email) return

  const currencyCode = order.currency_code || "usd"

  // Build items HTML rows
  const itemsHtml = order.items
    ?.map(
      (item: any) => `
        <tr style="border-bottom: 1px solid ${colors.border};">
          <td style="padding: 12px 0; font-size: 14px; color: ${colors.primary};">${item.title}${item.variant_title ? ` - ${item.variant_title}` : ""}</td>
          <td style="padding: 12px 0; font-size: 14px; color: ${colors.primary}; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; font-size: 14px; color: ${colors.primary}; text-align: right;">${formatCurrency(item.unit_price * item.quantity, currencyCode)}</td>
        </tr>`
    )
    .join("") || ""

  // Build shipping address string
  const addr = order.shipping_address
  const shippingAddress = addr
    ? [addr.address_1, addr.address_2, addr.city, addr.province, addr.postal_code, addr.country_code?.toUpperCase()]
        .filter(Boolean)
        .join(", ")
    : ""

  const shippingName = addr
    ? [addr.first_name, addr.last_name].filter(Boolean).join(" ")
    : ""

  const customerName = order.customer
    ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(" ")
    : ""

  const subtotal = order.item_subtotal ?? 0
  const shippingTotal = order.shipping_total ?? 0
  const total = order.total ?? 0

  const { subject, html } = renderTemplate(EmailTemplate.ORDER_CONFIRMATION, {
    order_number: String(order.display_id ?? order.id),
    items_html: itemsHtml,
    subtotal: formatCurrency(subtotal, currencyCode),
    shipping_total: formatCurrency(shippingTotal, currencyCode),
    total: formatCurrency(total, currencyCode),
    shipping_name: shippingName,
    shipping_address: shippingAddress,
    customer_name: customerName,
  })

  const text = `
LoopyLoopyGoods
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Confirmed! #${order.display_id ?? order.id}

Hi${customerName ? ` ${customerName}` : ""},

Thank you for your order! We've received it and are getting it ready.

Items:
${order.items?.map((item: any) => `- ${item.title}${item.variant_title ? ` (${item.variant_title})` : ""} x${item.quantity} — ${formatCurrency(item.unit_price * item.quantity, currencyCode)}`).join("\n") || ""}

Subtotal: ${formatCurrency(subtotal, currencyCode)}
Shipping: ${formatCurrency(shippingTotal, currencyCode)}
Total: ${formatCurrency(total, currencyCode)}
${shippingName ? `\nShipping To: ${shippingName}, ${shippingAddress}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
  `.trim()

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplate.ORDER_CONFIRMATION,
    content: { subject, html, text },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
