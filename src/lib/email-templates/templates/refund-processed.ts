import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function refundProcessedTemplate(data: TemplateData): string {
  let template = `
    <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Your refund has been processed
    </h3>
    <div style="color:${colors.primary};font-size:16px;font-weight:normal;text-align:left;padding:16px 24px 16px 24px">
      <p>Hi{{#customer_name}} {{customer_name}},{{/customer_name}}{{^customer_name}},{{/customer_name}}</p>
      <p>
        We would like to inform you that the refund amount of
        <strong>{{refund_amount}}</strong> for your order has been processed.
      </p>
      <p>
        Depending on your payment method, this may be returned to you
        in the next 24 hours, or in some cases it can take up to 5-10
        working days, depending on your payment provider and its
        processing time.
      </p>
      <p>
        We&#39;re sorry for the problem you had with your order and
        thanks for getting in touch.
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
