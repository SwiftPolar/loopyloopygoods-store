import { passwordResetTemplate } from "./templates/password-reset"
import { baseTemplate } from "./templates/base"
import { TemplateData } from "./utils"

export { TemplateData, interpolate } from "./utils"

export enum EmailTemplate {
  PASSWORD_RESET = "password-reset",
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
