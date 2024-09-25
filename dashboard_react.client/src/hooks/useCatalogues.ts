import { useQueryClient } from "@tanstack/react-query";
import { createCatalogue, updateCatalogue } from "../services/catalogueService";
import { useCatalogueStore } from "../store/useCatalogueStore";
import { ApiResponse } from "../types/ApiResponse";
import { CatalogueResponse } from "../types/CatalogueResponse";
import { ValidationFailure } from "../types/ValidationFailure";
import { SelectedCatalogue, useListCollections } from "./useListCollections";
import { QueryKeys } from "../config/contants";

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
    forceSelected?: SelectedCatalogue, 
  ): Promise<ApiResponse<CatalogueResponse | ValidationFailure[]>> => {

    const response = await createCatalogue(
      forceSelected?.selected ?? selectedCatalogue.selected,
      catalogue,
    );

    if (response.success) {
      client.refetchQueries({
        queryKey: [QueryKeys.Catalogues, forceSelected?.selected ?? selectedCatalogue.selected],
        type: "all",
        exact: true,
      });
    }

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
      queryKey: [QueryKeys.Catalogues, selectedCatalogue.selected],
      type: "all",
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
