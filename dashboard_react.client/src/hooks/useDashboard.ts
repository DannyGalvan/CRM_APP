import { useQuery } from "@tanstack/react-query";

import { MONTHS } from "../config/contants";
import { getOrdersByDay, getOrdersByMonth } from "../services/dashboardService";
import { DailyOrders } from "../types/DailyOrders";
import { MonthlyOrders } from "../types/MonthlyOrders";
import { ApiError } from "../util/errors";

export const useDashboard = () => {
  const year = new Date().getFullYear();
  const year_orders = `Ordenes ${year}`;
  const month = new Date().getMonth() + 1;
  const month_orders = `Ordenes ${MONTHS[month]}`;

  const { data, isPending, error } = useQuery<
    MonthlyOrders[],
    ApiError | undefined,
    DashboardMonthlyResponse
  >({
    queryKey: ["monthlyOrders"],
    queryFn: getOrdersByMonth,
    select: (data) => {
      return {
        orders: data.map((item: MonthlyOrders) => {
          return {
            date: MONTHS[item.id.month],
            [year_orders]: item.totalAmount.toFixed(2),
          };
        }),
        totalOrders: data.reduce((acc, item) => acc + item.totalAmount, 0),
        quantityOrders: data.reduce((acc, item) => acc + item.totalOrders, 0),
      };
    },
  });

  const {
    data: dataOrders,
    isPending: pendingOrders,
    error: errorOrders,
  } = useQuery<DailyOrders[], ApiError | undefined, DashboardDailyResponse>({
    queryKey: ["dailyOrders", month],
    queryFn: () => getOrdersByDay(month),
    select: (data) => {
      return {
        orders: data.map((item: DailyOrders) => {
          return {
            date: item.id.day,
            [month_orders]: item.totalAmount.toFixed(2),
            total: item.totalOrders,
          };
        }),
        totalOrders: data.reduce((acc, item) => acc + item.totalAmount, 0),
        quantityOrders: data.reduce((acc, item) => acc + item.totalOrders, 0),
      };
    },
  });

  return {
    year,
    month,
    year_orders,
    month_orders,
    data,
    isPending,
    dataOrders,
    pendingOrders,
    error: error || errorOrders,
  };
};
