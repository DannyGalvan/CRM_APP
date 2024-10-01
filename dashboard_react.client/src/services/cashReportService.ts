import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CashReportRequest } from "../types/CashReportRequest";
import { CashReportResponse } from "../types/CashReportResponse";
import { RouteRequest } from "../types/RouteRequest";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCashReports = async (
  filter?: string,
  page = 1,
  pageSize = 10,
) => {
  let response: ApiResponse<CashReportResponse[]>;

  if (filter) {
    response = await api.get<object, ApiResponse<CashReportResponse[]>>(
      `/cashReport?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<object, ApiResponse<CashReportResponse[]>>(
      `/cashReport?page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createCashReport = async (route: CashReportRequest) => {
  const response = await api.post<
    RouteRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>
  >("/cashReport", route);

  return response;
};

export const updateCashReport = async (route: CashReportRequest) => {
  const response = await api.put<
    CashReportRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>
  >(`/cashReport`, route);

  return response;
};

export const partialUpdateCashReport = async (route: CashReportRequest) => {
  const response = await api.patch<
    CashReportRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>
  >(`/cashReport`, route);

  return response;
};
