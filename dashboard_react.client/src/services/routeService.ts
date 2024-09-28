import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { RouteResponse } from "../types/RouteResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const createRoute = async (route: RouteRequest) => {
  const response = await api.post<
    RouteRequest,
    ApiResponse<RouteResponse | ValidationFailure[]>,
    any
  >("/route", route);

  return response;
};

export const getRoutes = async (filter?: string, page = 1, pageSize = 10) => {
  let response;

  if (filter) {
    response = await api.get<any, ApiResponse<RouteResponse[]>, any>(
      `/route?filters=State:eq:1 AND ${filter}&page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<any, ApiResponse<RouteResponse[]>, any>(
      `/route&page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const updateRoute = async (route: RouteRequest) => {
  const response = await api.put<
    RouteRequest,
    ApiResponse<RouteResponse | ValidationFailure[]>,
    any
  >(`/route`, route);

  return response;
};

export const partialUpdateRoute = async (route: RouteRequest) => {
  const response = await api.patch<
    RouteRequest,
    ApiResponse<RouteResponse | ValidationFailure[]>,
    any
  >(`/route`, route);

  return response;
};
