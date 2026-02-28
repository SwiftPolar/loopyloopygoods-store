import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderCancelledTemplate(data: TemplateData): string {
  let template = `
    <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Your order has been cancelled
    </h3>
    <div style="color:${colors.primary};font-size:16px;font-weight:normal;text-align:left;padding:16px 24px 16px 24px">
      <p>Hello{{#customer_name}} {{customer_name}},{{/customer_name}}{{^customer_name}},{{/customer_name}}</p>
      <p>
        It looks like you changed your mind or the items in your order
        are no longer available.
      </p>
      <p>
        We are currently processing your refund. If you have any
        additional questions, please reach out.
      </p>
      <p>Warmly,<br />loopyloopygoods</p>
    </div>`

  if (data.customer_name) {
    template = template.replace(/\{\{#customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
    template = template.replace(/\{\{\^customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
  } else {
    template = template.replace(/\{\{#customer_name\}\}.*?\{\{\/customer_name\}\}/gs, "")
    template = template.replace(/\{\{\^customer_name\}\}(.*?)\{\{\/customer_name\}\}/gs, "$1")
  }

  return interpolate(template, data)
}
