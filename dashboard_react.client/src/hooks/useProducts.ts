import { useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../services/productService";
import { useProductStore } from "../store/useProductStore";
import { ApiResponse } from "../types/ApiResponse";
import { ProductRequest } from "../types/ProductRequest";
import { ProductResponse } from "../types/ProductResponse";

export const useProducts = () => {
  const client = useQueryClient();
  const { add } = useProductStore();

  const create = async (product: ProductRequest) => {
    const response = await createProduct(product);

    client.refetchQueries({
      queryKey: ["products"],
      type: "active",
      exact: true,
    });

    return response;
  };

  const update = async (product: ProductRequest) => {
    const response = await updateProduct(product);

    await client.refetchQueries({
      queryKey: ["products"],
      type: "active",
      exact: true,
    });

    const products = client.getQueryData<ApiResponse<ProductResponse[]>>([
      "products",
    ]);

    if (products != undefined) {
      const find = products.data?.find((c) => c.id === product.id);

      if (find != undefined) {
        find.createdAt = null;
        find.updatedAt = null;
        find.updatedBy = null;
        find.createdBy = null;
      }

      find && add(find);
    }

    return response;
  };

  return { create, update };
};
