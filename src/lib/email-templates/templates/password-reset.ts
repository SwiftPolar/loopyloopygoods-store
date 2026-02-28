import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function passwordResetTemplate(data: TemplateData): string {
  const template = `
    <h3 style="color:${colors.primary};font-weight:bold;text-align:left;margin:0;font-size:20px;padding:32px 24px 0px 24px">
      Reset your password?
    </h3>
    <div style="color:${colors.primary};font-size:14px;font-weight:normal;text-align:left;padding:8px 24px 16px 24px">
      If you didn&#x27;t request a reset, don&#x27;t worry. You can safely ignore this email.
    </div>
    <div style="text-align:left;padding:12px 24px 32px 24px">
      <a href="{{reset_url}}"
        style="color:${colors.primary};font-size:14px;font-weight:bold;background-color:${colors.background};border-radius:64px;display:inline-block;padding:12px 20px;text-decoration:none"
        target="_blank">
        <span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:30" hidden>&nbsp;</i><![endif]--></span>
        <span>Change my password</span>
        <span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span>
      </a>
    </div>`

  return interpolate(template, data)
}
