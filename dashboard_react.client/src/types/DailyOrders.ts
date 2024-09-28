export interface DailyOrders {
  id: {
    day: number;
    month: number;
  };
  totalOrders: number;
  totalAmount: number;
}
