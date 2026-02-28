import { colors } from "../colors"
import { TemplateData, interpolate } from "../utils"

export function orderShippedTemplate(data: TemplateData): string {
  let template = `
    <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Woohoo! Your order is on its way!
    </h3>
    <div style="color:${colors.primary};font-size:16px;font-weight:normal;text-align:left;padding:16px 24px 16px 24px">
      <p>Hello{{#customer_name}} {{customer_name}},{{/customer_name}}{{^customer_name}},{{/customer_name}}</p>
      <p>
        Great news! Your order is headed your way. To keep an eye on
        your order, you can track the delivery status in your Order History.
      </p>
      {{#tracking_number}}<p>Tracking Number:<br />{{#tracking_url}}<a href="{{tracking_url}}" style="color:${colors.primary};font-weight:bold;text-decoration:none;">{{tracking_number}}</a>{{/tracking_url}}{{^tracking_url}}{{tracking_number}}{{/tracking_url}}</p>{{/tracking_number}}
      <p>Warmly,<br />loopyloopygoods</p>
    </div>
    <h3 style="font-weight:normal;text-align:left;margin:0;font-size:20px;padding:16px 24px 0px 24px">
      Items in this shipment
    </h3>
    <div style="padding:16px 24px 16px 24px">
      {{items_html}}
    </div>`

  const conditionalFields = ["customer_name", "tracking_number", "tracking_url"] as const
  for (const field of conditionalFields) {
    if (data[field]) {
      template = template.replace(new RegExp(`\\{\\{#${field}\\}\\}(.*?)\\{\\{\\/${field}\\}\\}`, "gs"), "$1")
      template = template.replace(new RegExp(`\\{\\{\\^${field}\\}\\}.*?\\{\\{\\/${field}\\}\\}`, "gs"), "")
    } else {
      template = template.replace(new RegExp(`\\{\\{#${field}\\}\\}.*?\\{\\{\\/${field}\\}\\}`, "gs"), "")
      template = template.replace(new RegExp(`\\{\\{\\^${field}\\}\\}(.*?)\\{\\{\\/${field}\\}\\}`, "gs"), "$1")
    }
  }

  return interpolate(template, data)
}
