import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate, formatCurrency } from "../lib/email-templates"
import { colors } from "../lib/email-templates/colors"

type OrderCancelledData = {
  id: string
}

export default async function orderCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderCancelledData>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "*",
      "items.*",
      "customer.*",
    ],
    filters: { id: data.id },
  })

  if (!order) return

  const email = order.email || order.customer?.email
  if (!email) return

  const currencyCode = order.currency_code || "usd"

  const customerName = order.customer
    ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(" ")
    : ""

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

  const { subject, html } = renderTemplate(EmailTemplate.ORDER_CANCELLED, {
    order_number: String(order.display_id ?? order.id),
    items_html: itemsHtml,
    customer_name: customerName,
  })

  const text = `
LoopyLoopyGoods
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Cancelled #${order.display_id ?? order.id}

Hi${customerName ? ` ${customerName}` : ""},

Your order #${order.display_id ?? order.id} has been cancelled. If a payment was made, a refund will be processed shortly.

Cancelled Items:
${order.items?.map((item: any) => `- ${item.title}${item.variant_title ? ` (${item.variant_title})` : ""} x${item.quantity} — ${formatCurrency(item.unit_price * item.quantity, currencyCode)}`).join("\n") || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
  `.trim()

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplate.ORDER_CANCELLED,
    content: { subject, html, text },
  })
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
