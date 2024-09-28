import { useQueryClient } from "@tanstack/react-query";

import { createProduct, updateProduct } from "../services/productService";
import { useProductStore } from "../store/useProductStore";
import { ProductRequest } from "../types/ProductRequest";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";

export const useProducts = () => {
  const client = useQueryClient();
  const { productFilters } = useProductStore();

  const rebootCatalogues = () => {
    updateSearch("Families", "");
  };

  const create = async (product: ProductRequest) => {
    const response = await createProduct(product);

    if (response.success) {
      client.refetchQueries({
        queryKey: [QueryKeys.Products],
        type: "all",
        exact: false,
      });

      rebootCatalogues();
    }

    return response;
  };

  const update = async (product: ProductRequest) => {
    const response = await updateProduct(product);

    client.refetchQueries({
      queryKey: [
        QueryKeys.Products,
        productFilters.filter,
        "",
        "",
        productFilters.page,
        productFilters.pageSize,
      ],
      type: "all",
      exact: true,
    });

    return response;
  };

  return { create, update };
};
