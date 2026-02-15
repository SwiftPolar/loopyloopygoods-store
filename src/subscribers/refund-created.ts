import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate, formatCurrency } from "../lib/email-templates"

type RefundCreatedData = {
  id: string
}

export default async function refundCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<RefundCreatedData>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Fetch the refund with its associated payment and order
  const { data: [refund] } = await query.graph({
    entity: "refund",
    fields: [
      "*",
      "payment.*",
      "payment.payment_collection.*",
    ],
    filters: { id: data.id },
  })

  if (!refund) return

  // Find the order associated with this refund via payment collection
  const paymentCollectionId = refund.payment?.payment_collection?.id
  if (!paymentCollectionId) return

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "*",
      "customer.*",
    ],
    filters: { payment_collections: { id: paymentCollectionId } } as any,
  })

  const order = orders?.[0]
  if (!order) return

  const email = order.email || order.customer?.email
  if (!email) return

  const currencyCode = order.currency_code || "usd"

  const customerName = order.customer
    ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(" ")
    : ""

  const refundAmount = refund.amount ?? 0

  const { subject, html } = renderTemplate(EmailTemplate.REFUND_PROCESSED, {
    order_number: String(order.display_id ?? order.id),
    refund_amount: formatCurrency(refundAmount, currencyCode),
    customer_name: customerName,
  })

  const text = `
LoopyLoopyGoods
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Refund Processed

Hi${customerName ? ` ${customerName}` : ""},

A refund of ${formatCurrency(refundAmount, currencyCode)} has been processed for your order #${order.display_id ?? order.id}.

The refund should appear in your account within 5-10 business days, depending on your payment provider.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
  `.trim()

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplate.REFUND_PROCESSED,
    content: { subject, html, text },
  })
}

export const config: SubscriberConfig = {
  event: "refund.created",
}
