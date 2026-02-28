import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderConfirmationTemplate(data: TemplateData): string {
  let template = `
    <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Thank you for your purchase!
    </h3>
    <div style="color:${colors.primary};font-size:16px;font-weight:normal;text-align:left;padding:16px 24px 16px 24px">
      <p>
        Hi{{#customer_name}} {{customer_name}},{{/customer_name}}{{^customer_name}},{{/customer_name}} yay!! Your order has been confirmed. We are
        currently processing it and we'll notify you once its ready for the mail.
        In the meantime, if you have any questions on your order, please reach out to us.
      </p>
      <p>Warmly,<br />loopyloopygoods</p>
    </div>
    <h3 style="font-weight:normal;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Order summary
    </h3>
    <div style="padding:16px 24px 16px 24px">
      {{items_html}}
      <div style="padding:8px 0px 8px 0px">
        <hr style="width:100%;border:none;border-top:1px solid ${colors.divider};margin:0" />
      </div>
    </div>
    <div style="padding:16px 24px 16px 24px">
      <table align="center" width="100%" cellpadding="0" border="0"
        style="table-layout:fixed;border-collapse:collapse">
        <tbody style="width:100%">
          <tr style="width:100%">
            <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:8px">
              <div style="padding:0px 0px 0px 0px"></div>
            </td>
            <td style="box-sizing:content-box;vertical-align:middle;padding-left:8px;padding-right:0">
              <div style="padding:0px 0px 0px 0px">
                <div style="padding:4px 0px 4px 0px">
                  <table align="center" width="100%" cellpadding="0" border="0"
                    style="table-layout:fixed;border-collapse:collapse">
                    <tbody style="width:100%">
                      <tr style="width:100%">
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="color:${colors.secondary};font-size:16px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">
                            Subtotal
                          </div>
                        </td>
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="font-size:16px;font-weight:bold;text-align:right;padding:0px 0px 0px 0px">
                            {{subtotal}}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style="padding:4px 0px 4px 0px">
                  <table align="center" width="100%" cellpadding="0" border="0"
                    style="table-layout:fixed;border-collapse:collapse">
                    <tbody style="width:100%">
                      <tr style="width:100%">
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="color:${colors.secondary};font-size:16px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">
                            Shipping
                          </div>
                        </td>
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="font-size:16px;font-weight:bold;text-align:right;padding:0px 0px 0px 0px">
                            {{shipping_total}}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style="padding:16px 0px 16px 0px">
                  <hr style="width:100%;border:none;border-top:1px solid ${colors.divider};margin:0" />
                </div>
                <div style="padding:4px 0px 4px 0px">
                  <table align="center" width="100%" cellpadding="0" border="0"
                    style="table-layout:fixed;border-collapse:collapse">
                    <tbody style="width:100%">
                      <tr style="width:100%">
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="color:${colors.secondary};font-size:16px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">
                            Total
                          </div>
                        </td>
                        <td style="box-sizing:content-box;vertical-align:middle;padding-left:0;padding-right:0">
                          <div style="font-size:18px;font-weight:bold;text-align:right;padding:0px 0px 0px 0px">
                            {{total}}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {{#shipping_name}}
    <h3 style="font-weight:normal;text-align:left;margin:0;font-size:20px;padding:40px 24px 24px 24px">
      Customer information
    </h3>
    <div style="padding:16px 24px 16px 24px">
      <div style="font-size:16px;font-weight:bold;text-align:left;padding:0px 0px 8px 0px">
        Shipping address
      </div>
      <div style="font-size:14px;font-weight:normal;text-align:left;padding:0px 0px 0px 0px">
        <p>{{shipping_name}}<br />{{shipping_address}}</p>
      </div>
    </div>
    {{/shipping_name}}`

  if (data.customer_name) {
    template = template.replace(/\{\{#customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
    template = template.replace(/\{\{\^customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
  } else {
    template = template.replace(/\{\{#customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
    template = template.replace(/\{\{\^customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
  }

  if (data.shipping_name) {
    template = template.replace(/\{\{#shipping_name\}\}(.*?)\{\{\/shipping_name\}\}/gs, "$1")
  } else {
    template = template.replace(/\{\{#shipping_name\}\}.*?\{\{\/shipping_name\}\}/gs, "")
  }

  return interpolate(template, data)
}
