

export interface CashReportResponse {
  id: string;
  cashierName: string;
  observations: string;
  orderQuantity: number;
  total: number;
  state: number;
  [key: string]: number | string | undefined;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}
