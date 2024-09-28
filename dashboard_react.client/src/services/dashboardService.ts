import { api } from "../config/axios/interceptors";
import { DailyOrders } from "../types/DailyOrders";
import { MonthlyOrders } from "../types/MonthlyOrders";

export const getOrdersByMonth = async () => {
  const response = await api.get<any, MonthlyOrders[], any>("/Dashboard");
  return response;
};

export const getOrdersByDay = async (month: number) => {
  const response = await api.get<any, DailyOrders[], any>(
    `/Dashboard/${month}`,
  );
  return response;
};
