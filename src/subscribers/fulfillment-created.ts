import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate } from "../lib/email-templates"
import { colors } from "../lib/email-templates/colors"

type FulfillmentCreatedData = {
  id: string
}

export default async function fulfillmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<FulfillmentCreatedData>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Query fulfillment with its linked order in one go
  const { data: [fulfillment] } = await query.graph({
    entity: "fulfillment",
    fields: [
      "*",
      "items.*",
      "labels.*",
      "order.*",
      "order.items.*",
      "order.customer.*",
    ],
    filters: { id: data.id },
  })

  if (!fulfillment) return

  const order = (fulfillment as any).order
  if (!order) return

  const email = order.email || order.customer?.email
  if (!email) return

  const customerName = order.customer
    ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(" ")
    : ""

  // Extract tracking info from fulfillment labels
  const trackingNumber = fulfillment.labels?.[0]?.tracking_number || ""
  const trackingUrl = fulfillment.labels?.[0]?.tracking_url || ""

  // Build items HTML blocks from fulfillment items (name+variant, no price)
  const itemsHtml = fulfillment.items
    ?.map(
      (fItem: any) => {
        const orderItem = order.items?.find((oi: any) => oi.id === fItem.line_item_id)
        const title = orderItem?.title || fItem.title || "Item"
        const variantTitle = orderItem?.variant_title
        return `
        <div style="padding:0px 0px 0px 0px">
          <table align="center" width="100%" cellpadding="0" border="0"
            style="table-layout:fixed;border-collapse:collapse">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                  <div style="font-size:16px;font-weight:bold;text-align:left;padding:0px 0px 4px 0px">
                    ${title}
                  </div>
                  ${variantTitle ? `<div style="color:${colors.secondary};font-size:14px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">${variantTitle}</div>` : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>`
      }
    )
    .join("") || ""

  const { subject, html } = renderTemplate(EmailTemplate.ORDER_SHIPPED, {
    order_number: String(order.display_id ?? order.id),
    items_html: itemsHtml,
    tracking_number: trackingNumber,
    tracking_url: trackingUrl,
    customer_name: customerName,
  })

  const itemsList = fulfillment.items
    ?.map((fItem: any) => {
      const orderItem = order.items?.find((oi: any) => oi.id === fItem.line_item_id)
      const title = orderItem?.title || fItem.title || "Item"
      return `- ${title} x${fItem.quantity}`
    })
    .join("\n") || ""

  const text = `
LoopyLoopyGoods
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Order Has Shipped! #${order.display_id ?? order.id}

Hi${customerName ? ` ${customerName}` : ""},

Great news! Your order is on its way.
${trackingNumber ? `\nTracking Number: ${trackingNumber}` : ""}${trackingUrl ? `\nTrack your order: ${trackingUrl}` : ""}

Items Shipped:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
  `.trim()

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplate.ORDER_SHIPPED,
    content: { subject, html, text },
  })
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}
