import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, EmailTemplate } from "../lib/email-templates"

export default async function resetPasswordTokenHandler({
  event: {
    data: { entity_id: email, token, actor_type },
  },
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Determine the reset URL based on actor type
  let resetUrl: string

  if (actor_type === "customer") {
    // Customer password reset - use storefront URL
    const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:8000"
    resetUrl = `${storefrontUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  } else {
    // Admin user password reset - use backend URL
    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    resetUrl = `${backendUrl}/app/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  }

  // Render the email template
  const { subject, html } = renderTemplate(EmailTemplate.PASSWORD_RESET, {
    email,
    reset_url: resetUrl,
  })

  // Plain text version for email clients that don't support HTML
  const text = `
LoopyLoopyGoods
nature-inspired fiber art kits & workshops
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reset Your Password

Hello ${email},

We received a request to reset your password for your LoopyLoopyGoods account. Click the link below to create a new password:

${resetUrl}

Note: This password reset link will expire soon for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

For security reasons, never share this reset link with anyone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
slow down, make something

© ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
  `.trim()

  // Send the notification via email channel
  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplate.PASSWORD_RESET,
    content: {
      subject,
      html,
      text,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
