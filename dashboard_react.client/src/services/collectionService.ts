import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CollectionResponse } from "../types/CollectionResponse";

export const getCollections = async () => {
  const response: ApiResponse<CollectionResponse[]> = await api.get<
    any,
    ApiResponse<CollectionResponse[]>,
    any
  >("/collection");
  
  return response;
};
