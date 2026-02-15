import { passwordResetTemplate } from "./templates/password-reset"
import { orderConfirmationTemplate } from "./templates/order-confirmation"
import { orderShippedTemplate } from "./templates/order-shipped"
import { orderCancelledTemplate } from "./templates/order-cancelled"
import { refundProcessedTemplate } from "./templates/refund-processed"
import { baseTemplate } from "./templates/base"
import { TemplateData } from "./utils"

export { TemplateData, interpolate, formatCurrency } from "./utils"

export enum EmailTemplate {
  PASSWORD_RESET = "password-reset",
  ORDER_CONFIRMATION = "order-confirmation",
  ORDER_SHIPPED = "order-shipped",
  ORDER_CANCELLED = "order-cancelled",
  REFUND_PROCESSED = "refund-processed",
}

interface TemplateConfig {
  subject: string
  render: (data: TemplateData) => string
}

const templates: Record<EmailTemplate, TemplateConfig> = {
  [EmailTemplate.PASSWORD_RESET]: {
    subject: "Reset Your Password",
    render: passwordResetTemplate,
  },
  [EmailTemplate.ORDER_CONFIRMATION]: {
    subject: "Order Confirmed!",
    render: orderConfirmationTemplate,
  },
  [EmailTemplate.ORDER_SHIPPED]: {
    subject: "Your Order Has Shipped!",
    render: orderShippedTemplate,
  },
  [EmailTemplate.ORDER_CANCELLED]: {
    subject: "Order Cancelled",
    render: orderCancelledTemplate,
  },
  [EmailTemplate.REFUND_PROCESSED]: {
    subject: "Refund Processed",
    render: refundProcessedTemplate,
  },
}

/**
 * Renders an email template with the provided data
 */
export function renderTemplate(
  templateId: EmailTemplate,
  data: TemplateData
): { subject: string; html: string } {
  const template = templates[templateId]

  if (!template) {
    throw new Error(`Template "${templateId}" not found`)
  }

  const content = template.render(data)
  const html = baseTemplate({
    content,
    previewText: template.subject,
  })

  return {
    subject: template.subject,
    html,
  }
}

/**
 * Gets the subject line for a template
 */
export function getTemplateSubject(templateId: EmailTemplate): string {
  const template = templates[templateId]

  if (!template) {
    throw new Error(`Template "${templateId}" not found`)
  }

  return template.subject
}
