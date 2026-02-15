import { colors } from "../colors"

interface BaseTemplateProps {
  content: string;
  previewText?: string;
}

export function baseTemplate({
  content,
  previewText,
}: BaseTemplateProps): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${previewText || "LoopyLoopyGoods"}</title>
    <!--[if mso]>
    <style type="text/css">
      body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

      body {
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          sans-serif;
        background-color: ${colors.background};
        margin: 0;
        padding: 24px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: ${colors.primary};
      }
      a {
        color: ${colors.primary};
      }
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
      }
      .email-container {
        background-color: ${colors.background};
        border: 1px solid ${colors.border};
        border-radius: 16px;
        padding: 40px;
        margin: 20px 0;
      }
      .header {
        text-align: center;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid ${colors.border};
      }
      .logo {
        font-size: 28px;
        font-weight: 700;
        color: ${colors.primary};
        text-decoration: none;
        letter-spacing: -0.5px;
      }
      .title {
        color: ${colors.primary};
        font-size: 26px;
        font-weight: 700;
        margin: 24px 0 16px 0;
        text-align: center;
        letter-spacing: -0.5px;
      }
      .content {
        margin: 24px 0;
      }
      .text {
        color: ${colors.primary};
        font-size: 15px;
        line-height: 26px;
        margin: 0 0 16px 0;
      }
      .button-container {
        text-align: center;
        margin: 32px 0;
      }
      .button {
        background-color: ${colors.primary};
        border-radius: 9999px;
        color: ${colors.background} !important;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        padding: 14px 32px;
        display: inline-block;
        transition: opacity 0.2s;
      }
      .button:hover {
        opacity: 0.9;
      }
      .url-section {
        margin: 24px 0;
        padding: 16px;
        background-color: ${colors.background};
        border-radius: 12px;
        border: 1px solid ${colors.border};
      }
      .url-label {
        color: ${colors.muted};
        font-size: 12px;
        margin: 0 0 8px 0;
      }
      .url-link {
        color: ${colors.primary};
        text-decoration: none;
        font-size: 13px;
        line-height: 20px;
        word-break: break-all;
      }
      .disclaimer {
        margin: 24px 0 0 0;
        padding-top: 24px;
        border-top: 1px solid ${colors.border};
      }
      .disclaimer-text {
        color: ${colors.muted};
        font-size: 12px;
        line-height: 20px;
        margin: 0 0 8px 0;
      }
      .footer {
        text-align: center;
        padding: 24px 20px;
        background-color: ${colors.footer};
        border-radius: 12px;
        margin-top: 8px;
      }
      .footer-text {
        color: ${colors.primary};
        font-size: 12px;
        line-height: 20px;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <a href="#" class="logo">LoopyLoopyGoods</a>
        </div>
        ${content}
      </div>
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} LoopyLoopyGoods. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>`;
}
