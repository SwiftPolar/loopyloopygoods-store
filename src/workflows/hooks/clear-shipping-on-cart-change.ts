import {
  addToCartWorkflow,
  updateLineItemInCartWorkflow,
} from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { StepResponse } from "@medusajs/workflows-sdk";

async function removeCartShippingMethods(
  cartId: string,
  container: any,
): Promise<void> {
  const cartModule = container.resolve(Modules.CART);

  const [cart] = await cartModule.listCarts(
    { id: [cartId] },
    { relations: ["shipping_methods"] },
  );

  if (!cart?.shipping_methods?.length) return;

  const shippingMethodIds = cart.shipping_methods.map((m: any) => m.id);
  await cartModule.deleteShippingMethods(shippingMethodIds);
}

addToCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  await removeCartShippingMethods(input.cart_id, container);
  return new StepResponse();
});

updateLineItemInCartWorkflow.hooks.validate(
  async ({ input }, { container }) => {
    await removeCartShippingMethods(input.cart_id, container);
    return new StepResponse();
  },
);
