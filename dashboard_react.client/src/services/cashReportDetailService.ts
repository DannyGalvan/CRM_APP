import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { BulkCashReportDetailRequest } from "../types/BulkCashReportDetailRequest";
import { CashReportDetailsRequest } from "../types/CashReportDetailRequest";
import { CashReportDetailsResponse } from "../types/CashReportDetailResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCashReportDetails = async (filter?: string) => {
  let response;

  if (filter) {
    response = await api.get<
      any,
      ApiResponse<CashReportDetailsResponse[]>,
      any
    >(`/CashReportDetail?filters=${filter}&thenInclude=true`);
  } else {
    response = await api.get<
      any,
      ApiResponse<CashReportDetailsResponse[]>,
      any
    >("/CashReportDetail");
  }

  return response;
};

export const bulkCreateCashReportDetail = async (
  route: BulkCashReportDetailRequest,
) => {
  const response = await api.post<
    BulkCashReportDetailRequest,
    ApiResponse<CashReportDetailsResponse[] | ValidationFailure[]>,
    any
  >("/CashReportDetail/Bulk", route);

  return response;
};

export const updateCashReportDetail = async (
  route: CashReportDetailsRequest,
) => {
  const response = await api.put<
    CashReportDetailsResponse,
    ApiResponse<CashReportDetailsResponse | ValidationFailure[]>,
    any
  >(`/CashReportDetail`, route);

  return response;
};
