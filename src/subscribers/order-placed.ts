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

  // Build items HTML blocks (one table per item, name+variant | price)
  const itemsHtml = order.items
    ?.map(
      (item: any) => `
        <div style="padding:0px 0px 0px 0px">
          <table align="center" width="100%" cellpadding="0" border="0"
            style="table-layout:fixed;border-collapse:collapse">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:10px">
                  <div style="font-size:16px;font-weight:bold;text-align:left;padding:0px 0px 4px 0px">
                    ${item.title}
                  </div>
                  ${item.variant_title ? `<div style="color:${colors.secondary};font-size:14px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">${item.variant_title}</div>` : ""}
                </td>
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:10px;padding-right:0;width:80px">
                  <div style="font-size:16px;font-weight:bold;text-align:right;padding:0px 0px 0px 0px">
                    ${formatCurrency(item.unit_price * item.quantity, currencyCode)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>`
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
