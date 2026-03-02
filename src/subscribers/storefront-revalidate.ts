import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

const STOREFRONT_EVENTS = [
  // Products
  "product.created",
  "product.updated",
  "product.deleted",
  // Product variants
  "product-variant.created",
  "product-variant.updated",
  "product-variant.deleted",
  // Product options
  "product-option.created",
  "product-option.updated",
  "product-option.deleted",
  // Collections
  "product-collection.created",
  "product-collection.updated",
  "product-collection.deleted",
  // Categories
  "product-category.created",
  "product-category.updated",
  "product-category.deleted",
  // Inventory — fires when quantity is updated in the admin
  "inventory-item.created",
  "inventory-item.updated",
  "inventory-item.deleted",
  "inventory-level.created",
  "inventory-level.updated",
  "inventory-level.deleted",
  // Regions
  "region.created",
  "region.updated",
  "region.deleted",
  // Pricing
  "price-list.created",
  "price-list.updated",
  "price-list.deleted",
] as const

type StorefrontEvent = (typeof STOREFRONT_EVENTS)[number]

export default async function storefrontRevalidate({
  event,
}: SubscriberArgs<unknown>) {
  const storefrontUrl = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!storefrontUrl || !secret) {
    console.warn(
      "[storefront-revalidate] STOREFRONT_URL or REVALIDATE_SECRET is not set — skipping revalidation"
    )
    return
  }

  const url = `${storefrontUrl}/api/revalidate`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ event: event.name }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(
        `[storefront-revalidate] Revalidation failed for event "${event.name}": ${res.status} ${text}`
      )
      return
    }

    const data = await res.json()
    console.log(
      `[storefront-revalidate] event="${event.name}" → tags invalidated: ${data.tags?.join(", ")}`
    )
  } catch (err) {
    console.error(
      `[storefront-revalidate] Network error calling ${url}:`,
      err
    )
  }
}

export const config: SubscriberConfig = {
  event: STOREFRONT_EVENTS as unknown as string[],
}
