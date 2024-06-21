import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CollectionRequest } from "../types/CollectionRequest";
import { CollectionResponse } from "../types/CollectionResponse";

export const getCollections = async () => {
  const response: ApiResponse<CollectionResponse[]> = await api.get<
    any,
    ApiResponse<CollectionResponse[]>,
    any
  >("/collection");
  
  return response;
};

export const getCollection = async (id: string) => {
  const response: ApiResponse<CollectionResponse> = await api.get<
    any,
    ApiResponse<CollectionResponse>,
    any
  >(`/collection/${id}`);
  
  return response;
};

export const createCollection = async (data: CollectionRequest) => {
  const response: ApiResponse<CollectionResponse> = await api.post<
    any,
    ApiResponse<CollectionResponse>,
    CollectionRequest
  >("/collection", data);
  
  return response;
};

export const updateCollection = async (data: CollectionRequest) => {
  const response: ApiResponse<CollectionResponse> = await api.put<
    any,
    ApiResponse<CollectionResponse>,
    CollectionRequest
  >(`/collection`, data);
  
  return response;
};

export const partialUpdateCollection = async (data: CollectionRequest) => {
  const response: ApiResponse<CollectionResponse> = await api.patch<
    any,
    ApiResponse<CollectionResponse>,
    CollectionRequest
  >(`/collection`, data);
  
  return response;
}
