export interface CashReportResponse {
  id: string;
  cashierName: string;
  observations: string;
  orderQuantity: number;
  total: number;
  state: number;
  totalByPaymentTypes: Record<string, number>;
  createdAt: string | null;
  updatedAt?: string | null;
  createdBy: string | null;
  updatedBy?: string | null;
}
