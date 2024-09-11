import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { BulkRouteDetailRequest } from "../types/BulkRouteDetailRequest";
import { RouteDetailsRequest } from "../types/RouteDetailsRequest";
import { RouteDetailsResponse } from "../types/RouteDetailsResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getRouteDetails = async (filter?: string) => {
  let response;

  if (filter) {
    response = await api.get<any, ApiResponse<RouteDetailsResponse[]>, any>(
      `/routeDetail?filters=${filter}&thenInclude=true`,
    );
  } else {
    response = await api.get<any, ApiResponse<RouteDetailsResponse[]>, any>(
      "/routeDetail",
    );
  }

  return response;
};

export const bulkCreateRouteDetail = async (route: BulkRouteDetailRequest) => {
  const response = await api.post<
    BulkRouteDetailRequest,
    ApiResponse<RouteDetailsResponse[] | ValidationFailure[]>,
    any
  >("/routeDetail/bulk", route);

  return response;
};

export const updateRouteDetail = async (route: RouteDetailsRequest) => {
  const response = await api.put<
    RouteDetailsResponse,
    ApiResponse<RouteDetailsResponse | ValidationFailure[]>,
    any
  >(`/routeDetail`, route);

  return response;
};
