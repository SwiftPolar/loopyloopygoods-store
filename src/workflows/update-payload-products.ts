import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { retrievePayloadItemsStep } from "./steps/retrieve-payload-items";
import { updatePayloadItemsStep } from "./steps/update-payload-items";

type WorkflowInput = {
  product_ids: string[];
};

export const updatePayloadProductsWorkflow = createWorkflow(
  "update-payload-products",
  (input: WorkflowInput) => {
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "title", "handle"],
      filters: {
        id: input.product_ids,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    }) as any;

    const retrieveWhere = transform({ products }, data => ({
      collection: "products",
      where: {
        medusa_id: {
          in: data.products.map((p: any) => p.id).join(","),
        },
      },
    }));

    const { items: payloadProducts } = retrievePayloadItemsStep(retrieveWhere);

    const updateData = transform({ products, payloadProducts }, data => {
      const medusaMap = new Map(data.products.map((p: any) => [p.id, p]));

      const items = data.payloadProducts
        .map((payloadProduct: any) => {
          const medusaProduct = medusaMap.get(payloadProduct.medusa_id) as any;
          if (!medusaProduct) return null;

          return {
            id: payloadProduct.id,
            title: medusaProduct.title,
            handle: medusaProduct.handle,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return {
        collection: "products",
        items,
      };
    });

    const result = when(
      { updateData },
      data => data.updateData.items.length > 0,
    ).then(() => updatePayloadItemsStep(updateData));

    const items = transform({ result }, data => data.result?.items || []);

    return new WorkflowResponse({ items });
  },
);
