export interface MonthlyOrders {
  id: {
    month: number;
    year: number;
  };
  totalOrders: number;
  totalAmount: number;
}
