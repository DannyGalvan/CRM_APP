import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CashReportRequest } from "../types/CashReportRequest";
import { CashReportResponse } from "../types/CashReportResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCashReports = async (filter?: string) => {
  let response;

  if (filter) {
    response = await api.get<any,ApiResponse<CashReportResponse[]>,any>(
      `/cashReport?filters=${filter}`
    );
  } else {
    response = await api.get<any, ApiResponse<CashReportResponse[]>, any>("/cashReport");
  }

  return response;
};

export const createCashReport = async (route: CashReportRequest) => {
  const response = await api.post<
    RouteRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>,
    any
  >("/cashReport", route);

  return response;
};

export const updateCashReport = async (route: CashReportRequest) => {
  const response = await api.put<
    CashReportRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>,
    any
  >(`/cashReport`, route);

  return response;
};

export const partialUpdateCashReport = async (route: CashReportRequest) => {
  const response = await api.patch<
    CashReportRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>,
    any
  >(`/cashReport`, route);

  return response;
}
