import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CatalogueResponse } from "../types/CatalogueResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getAllCatalogues = async (catalogue?: string, filter?: string) => {
  if (!catalogue) {
    const error: ApiResponse<CatalogueResponse[]> = {
      success: false,
      message: "Catalogue not found",
      data: [],
    };

    return error;
  }

  if (filter) {
    const response = await api.get<
      ApiResponse<CatalogueResponse[] | ValidationFailure[]>,
      any
    >(`/${catalogue}?filters=${filter}`);

    return response;
  } else {
    const response = await api.get<
      ApiResponse<CatalogueResponse[] | ValidationFailure[]>,
      any
    >(`/${catalogue}`);

    return response;
  }
};

export const createCatalogue = async (
  catalogue?: string,
  data?: CatalogueRequest,
) => {
  if (!catalogue) {
    const error: ApiResponse<ValidationFailure[]> = {
      success: false,
      message: "Porfavor selecciona el catalogo al que deseas agregar un item",
      data: [],
    };

    return error;
  }

  const response = await api.post<
    CatalogueRequest,
    ApiResponse<CatalogueResponse | ValidationFailure[]>,
    any
  >(`/${catalogue}`, data);

  return response;
};

export const updateCatalogue = async (
  catalogue?: string,
  data?: CatalogueRequest,
) => {
  if (!catalogue) {
    const error: ApiResponse<ValidationFailure[]> = {
      success: false,
      message: "Porfavor selecciona el catalogo al que deseas agregar un item",
      data: [],
    };

    return error;
  }

  const response = await api.put<
    CatalogueRequest,
    ApiResponse<CatalogueResponse | ValidationFailure[]>,
    any
  >(`/${catalogue}`, data);

  return response;
};
