import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CashReportRequest } from "../types/CashReportRequest";
import { CashReportResponse } from "../types/CashReportResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const createCashReport = async (route: CashReportRequest) => {
  const response = await api.post<
    RouteRequest,
    ApiResponse<CashReportResponse | ValidationFailure[]>,
    any
  >("/cashReport", route);

  return response;
};
