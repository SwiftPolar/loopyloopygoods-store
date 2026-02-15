import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate, formatCurrency } from "../lib/email-templates"

type PaymentRefundedData = {
  id: string
}

export default async function paymentRefundedHandler({
  event: { data },
  container,
}: SubscriberArgs<PaymentRefundedData>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Fetch the payment with its refunds and linked order
  const { data: [payment] } = await query.graph({
    entity: "payment",
    fields: [
      "*",
      "refunds.*",
      "payment_collection.order.*",
      "payment_collection.order.customer.*",
    ],
    filters: { id: data.id },
  })

  if (!payment) return

  const order = (payment as any).payment_collection?.order
  if (!order) return

  const email = order.email || order.customer?.email
  if (!email) return

  const currencyCode = order.currency_code || "usd"

  const customerName = order.customer
    ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(" ")
    : ""

  // Get the most recent refund amount, or sum all refunds
  const latestRefund = payment.refunds?.sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )?.[0]
  const refundAmount = latestRefund?.amount ?? 0

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
  event: "payment.refunded",
}
