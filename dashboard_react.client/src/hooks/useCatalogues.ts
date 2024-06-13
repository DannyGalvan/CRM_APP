import { useQueryClient } from "@tanstack/react-query";
import { createCatalogue, updateCatalogue } from "../services/catalogueService";
import { useCatalogueStore } from "../store/useCatalogueStore";
import { ApiResponse } from "../types/ApiResponse";
import { CatalogueResponse } from "../types/CatalogueResponse";
import { ValidationFailure } from "../types/ValidationFailure";
import { useListCollections } from "./useListCollections";

export const useCatalogues = () => {
  const client = useQueryClient();
  const { add } = useCatalogueStore();
  const {
    collectionError,
    collectionFetching,
    collectionLoading,
    selectedCatalogue,
    handleSelect,
    collections,
  } = useListCollections();

  const createCatalog = async (
    catalogue: CatalogueRequest,
  ): Promise<ApiResponse<CatalogueResponse | ValidationFailure[]>> => {
    const response = await createCatalogue(
      selectedCatalogue.selected,
      catalogue,
    );

    client.refetchQueries({
      queryKey: ["catalogues", selectedCatalogue.selected],
      type: "active",
      exact: true,
    });

    return response;
  };

  const updateCatalog = async (
    catalogue: CatalogueRequest,
  ): Promise<ApiResponse<CatalogueResponse | ValidationFailure[]>> => {
    const response = await updateCatalogue(
      selectedCatalogue.selected,
      catalogue,
    );

    add(catalogue);

    client.refetchQueries({
      queryKey: ["catalogues", selectedCatalogue.selected],
      type: "active",
      exact: true,
    });

    return response;
  };

  return {
    collectionError,
    collectionFetching,
    collectionLoading,
    selectedCatalogue,
    handleSelect,
    collections,
    createCatalog,
    updateCatalog,
  };
};
