import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { listShippingOptionsForCartWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id, option_ids, is_return, enabled_in_store, fields } =
    req.query as Record<string, string | string[] | undefined>;

  if (!cart_id || typeof cart_id !== "string") {
    return res.status(400).json({ message: "cart_id is required" });
  }

  const query = req.scope.resolve("query");

  // Fetch cart line items with their product shipping profiles
  const { data: carts } = await query.graph({
    entity: "cart",
    filters: { id: cart_id },
    fields: [
      "id",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "items.variant.product.shipping_profile.*",
    ],
  });

  const cart = carts[0];

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Collect distinct shipping profile ids from items that require shipping
  const items: any[] = cart.items ?? [];
  const requiresShipping = items.filter((item) => {
    return !!item.variant?.product?.shipping_profile;
  });
  if (requiresShipping.length === 0) {
    return res.json({ shipping_options: [] });
  }

  const profileIds: Set<string> = new Set(
    requiresShipping.map(
      (item) => item.variant.product.shipping_profile.id as string,
    ),
  );

  // Run the core workflow to get all candidate shipping options
  const { result: allOptions } = await listShippingOptionsForCartWorkflow(
    req.scope,
  ).run({
    input: {
      cart_id,
      ...(option_ids && {
        option_ids: Array.isArray(option_ids) ? option_ids : [option_ids],
      }),
      ...(fields && {
        fields: Array.isArray(fields) ? fields : [fields],
      }),
      ...(is_return !== undefined && { is_return: is_return === "true" }),
      ...(enabled_in_store !== undefined && {
        enabled_in_store: enabled_in_store === "true",
      }),
    },
  });

  // If no items require shipping profiles, return everything as-is
  if (profileIds.size === 0) {
    return res.json({ shipping_options: allOptions });
  }

  // Group options by their shipping_profile_id
  const optionsByProfile = new Map<string, any[]>();
  for (const option of allOptions) {
    const pid: string = option.shipping_profile_id;
    if (!optionsByProfile.has(pid)) {
      optionsByProfile.set(pid, []);
    }
    optionsByProfile.get(pid)!.push(option);
  }

  // Rule 1: keep options whose profile is required by ALL items in the cart.
  // Since one option maps to one profile, this means only profiles that every
  // item shares — i.e. the profile must appear in every item's profile set.
  // In practice this means: all items share a single profile (profileIds.size === 1)
  // and that profile has options available.
  const universalOptions: any[] = [];
  for (const [pid, opts] of optionsByProfile) {
    if (profileIds.has(pid) && profileIds.size === 1) {
      universalOptions.push(...opts);
    }
  }

  if (universalOptions.length > 0) {
    return res.json({ shipping_options: universalOptions });
  }

  // Rule 2: no single option covers all profiles — return options from the
  // most expensive profile (highest minimum option price).
  // "Price" here uses the raw amount from the option's prices array.
  let mostExpensiveProfileId: string | null = null;
  let highestMinPrice = -Infinity;

  for (const [pid, opts] of optionsByProfile) {
    if (!profileIds.has(pid)) continue;

    const minPrice = opts.reduce((acc: number, opt: any) => {
      const prices: any[] = opt.prices ?? [];
      const lowestForOption = prices.reduce(
        (a: number, p: any) => Math.min(a, p.amount ?? Infinity),
        Infinity,
      );
      return Math.min(acc, lowestForOption === Infinity ? 0 : lowestForOption);
    }, Infinity);

    const effectiveMin = minPrice === Infinity ? 0 : minPrice;

    if (effectiveMin > highestMinPrice) {
      highestMinPrice = effectiveMin;
      mostExpensiveProfileId = pid;
    }
  }

  const fallbackOptions = mostExpensiveProfileId
    ? (optionsByProfile.get(mostExpensiveProfileId) ?? [])
    : allOptions;

  return res.json({ shipping_options: fallbackOptions });
}
