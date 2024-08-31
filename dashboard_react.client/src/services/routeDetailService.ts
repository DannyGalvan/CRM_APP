import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { BulkRouteDetailRequest } from "../types/BulkRouteDetailRequest";
import { RouteDetailsResponse } from "../types/RouteDetailsResponse";
import { ValidationFailure } from "../types/ValidationFailure";


export const bulkCreateRouteDetail = async (route: BulkRouteDetailRequest) => {
    const response = await api.post<
      BulkRouteDetailRequest,
      ApiResponse<RouteDetailsResponse[] | ValidationFailure[]>,
      any
    >("/routeDetail/bulk", route);
  
    return response;
  };