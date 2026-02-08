import { TemplateData, interpolate } from "../utils"

export function passwordResetTemplate(data: TemplateData): string {
  const template = `
    <h1 class="title">Reset Your Password</h1>

    <div class="content">
      <p class="text">Hello{{#email}} <strong>{{email}}</strong>{{/email}},</p>
      <p class="text">
        We received a request to reset your password for your LoopyLoopyGoods account.
        Click the button below to create a new password.
      </p>
    </div>

    <div class="button-container">
      <a href="{{reset_url}}" class="button">Reset Password &rarr;</a>
    </div>

    <div class="url-section">
      <p class="url-label">Or copy and paste this URL into your browser:</p>
      <a href="{{reset_url}}" class="url-link">{{reset_url}}</a>
    </div>

    <div class="disclaimer">
      <p class="disclaimer-text">
        <strong>Note:</strong> This password reset link will expire soon for security reasons.
      </p>
      <p class="disclaimer-text">
        If you didn't request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </p>
      <p class="disclaimer-text" style="margin-top: 12px; font-style: italic;">
        For security reasons, never share this reset link with anyone.
      </p>
    </div>
  `

  // Handle conditional email display
  let result = template
  if (data.email) {
    result = result.replace(/\{\{#email\}\}(.*?)\{\{\/email\}\}/gs, "$1")
  } else {
    result = result.replace(/\{\{#email\}\}.*?\{\{\/email\}\}/gs, "")
  }

  return interpolate(result, data)
}
