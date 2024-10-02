import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { SearchCatalogue } from "../types/Catalogue";
import { CatalogueResponse } from "../types/CatalogueResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getAllCatalogues = async <T extends SearchCatalogue>(
  catalogue?: string,
  filter?: string,
) => {
  if (!catalogue) {
    const error: ApiResponse<T[]> = {
      success: false,
      message: "Catalogue not found",
      data: [],
      totalResults: 0,
    };

    return error;
  }

  if (filter) {
    const response = await api.get<object, ApiResponse<T[]>>(
      `/${catalogue}?filters=${filter}`,
    );

    return response;
  } else {
    const response = await api.get<object, ApiResponse<T[]>>(`/${catalogue}`);

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
      totalResults: 0,
    };

    return error;
  }

  const response = await api.post<
    CatalogueRequest,
    ApiResponse<CatalogueResponse | ValidationFailure[]>
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
      totalResults: 0,
    };

    return error;
  }

  const response = await api.put<
    CatalogueRequest,
    ApiResponse<CatalogueResponse | ValidationFailure[]>
  >(`/${catalogue}`, data);

  return response;
};
