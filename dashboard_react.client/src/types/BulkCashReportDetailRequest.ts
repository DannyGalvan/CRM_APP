import { CashReportDetailsRequest } from "./CashReportDetailRequest";

export interface BulkCashReportDetailRequest {
  cashReportDetails: CashReportDetailsRequest[];
  createdBy: string;
}
