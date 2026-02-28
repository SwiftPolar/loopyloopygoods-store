import { colors } from "../colors"

interface BaseTemplateProps {
  content: string
  order_number?: string
  footer_type?: "social" | "simple"
}

export function baseTemplate({
  content,
  order_number,
  footer_type = "social",
}: BaseTemplateProps): string {
  const header =
    footer_type === "simple"
      ? `
        <div style="padding:24px 24px 8px 24px;text-align:left">
          <img alt="loopyloopygoods"
            src="https://loopyloopygoods.com/_next/image?url=%2Floopyloopygoods_logo.png&amp;w=3840&amp;q=75"
            width="70"
            style="width:70px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%" />
        </div>`
      : `
        <div style="padding:16px 24px 24px 24px">
          <table align="center" width="100%" cellpadding="0" border="0"
            style="table-layout:fixed;border-collapse:collapse">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                  <div style="padding:0px 0px 0px 0px">
                    <div style="padding:16px 24px 16px 24px">
                      <a href="https://loopyloopygoods.com" style="text-decoration:none" target="_blank">
                        <img alt="loopyloopygoods"
                          src="https://loopyloopygoods.com/_next/image?url=%2Floopyloopygoods_logo.png&amp;w=3840&amp;q=75"
                          width="70"
                          style="width:70px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%" />
                      </a>
                    </div>
                  </div>
                </td>
                ${order_number ? `
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                  <div style="padding:0px 0px 0px 0px">
                    <div style="color:${colors.secondary};font-size:14px;font-weight:normal;text-align:right;padding:0px 0px 0px 0px">
                      #${order_number}
                    </div>
                  </div>
                </td>` : ""}
              </tr>
            </tbody>
          </table>
        </div>`

  const footer =
    footer_type === "simple"
      ? `
        <div style="padding:16px 24px 16px 24px">
          <hr style="width:100%;border:none;border-top:1px solid ${colors.divider};margin:0" />
        </div>
        <div style="color:${colors.primary};font-size:12px;font-weight:normal;text-align:left;padding:4px 24px 24px 24px">
          Need help? Just reply to this email to contact support.
        </div>`
      : `
        <div style="height:40px"></div>
        <div style="font-size:12px;font-weight:normal;text-align:center;padding:4px 24px 4px 24px">
          FOLLOW US ON
        </div>
        <div style="padding:0px 24px 0px 24px">
          <table align="center" width="100%" cellpadding="0" border="0"
            style="table-layout:fixed;border-collapse:collapse">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:8px">
                  <div style="padding:16px 0px 16px 0px;text-align:right">
                    <a href="https://instagram.com/loopyloopygoods" style="text-decoration:none" target="_blank">
                      <img alt="Instagram"
                        src="https://assets.joqhl8w6.on-eva.io/image/9d9ce47a-2e48-437d-9f57-b86de80cceb1.png"
                        width="20"
                        style="width:20px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%" />
                    </a>
                  </div>
                </td>
                <td style="box-sizing:content-box;vertical-align:middle;padding-left:8px;padding-right:0">
                  <div style="padding:16px 0px 16px 0px">
                    <a href="https://www.tiktok.com/@loopygoods" style="text-decoration:none" target="_blank">
                      <img alt="Tiktok"
                        src="https://assets.joqhl8w6.on-eva.io/image/6173cf6a-af6b-4217-b305-fdd7cf7e756f.png"
                        width="20"
                        style="width:20px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%" />
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="padding:16px 0px 16px 0px">
          <hr style="width:100%;border:none;border-top:1px solid ${colors.divider};margin:0" />
        </div>
        <div style="color:${colors.secondary};font-size:14px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px">
          If you have any questions, reply to this email or contact us at hello@loopyloopygoods.com
        </div>`

  return `<!doctype html>
<html>
<body>
  <div style='background-color:#FFFFFF;color:${colors.primary};font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'>
    <table align="center" width="100%" style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
      role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tbody>
        <tr style="width:100%">
          <td>
            ${header}
            ${content}
            ${footer}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`
}
