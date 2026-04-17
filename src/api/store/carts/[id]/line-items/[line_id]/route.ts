import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id: cart_id, line_id } = req.params;

  const cartModule = req.scope.resolve(Modules.CART);

  const [cart] = await cartModule.listCarts(
    { id: [cart_id] },
    { relations: ["shipping_methods"] },
  );

  if (cart?.shipping_methods?.length) {
    const ids = cart.shipping_methods.map((m: any) => m.id);
    await cartModule.deleteShippingMethods(ids);
  }

  await deleteLineItemsWorkflow(req.scope).run({
    input: { cart_id, ids: [line_id] },
  });

  const query = req.scope.resolve("query");
  const {
    data: [updatedCart],
  } = await query.graph({
    entity: "cart",
    filters: { id: cart_id },
    fields: req.queryConfig?.fields ?? ["*", "items.*", "shipping_methods.*"],
  });

  res.status(200).json({
    id: line_id,
    object: "line-item",
    deleted: true,
    parent: updatedCart,
  });
}
