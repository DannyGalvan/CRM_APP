import { useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../services/productService";
import { useProductStore } from "../store/useProductStore";
import { ApiResponse } from "../types/ApiResponse";
import { ProductRequest } from "../types/ProductRequest";
import { ProductResponse } from "../types/ProductResponse";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";

export const useProducts = () => {
  const client = useQueryClient();
  const { add} = useProductStore();

  const rebootCatalogues = () => {
    updateSearch("Families", "");
  };

  const create = async (product: ProductRequest) => {
    const response = await createProduct(product);

    if (response.success) {
      client.refetchQueries({
        queryKey: [QueryKeys.Products],
        type: "all",
        exact: true,
      });

      rebootCatalogues();
    }

    return response;
  };

  const update = async (product: ProductRequest) => {
    const response = await updateProduct(product);

    await client.refetchQueries({
      queryKey: [QueryKeys.Products],
      type: "all",
      exact: true,
    });

    const products = client.getQueryData<ApiResponse<ProductResponse[]>>([
      QueryKeys.Products,
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
