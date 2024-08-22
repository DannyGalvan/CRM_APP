
interface DashboardMonthlyOrder {
    [key: string]: string;
}

interface DashboardMonthlyResponse {
    orders: DashboardMonthlyOrder[];
    totalOrders: number;
    quantityOrders: number | undefined;
}

interface DashboardDailyOrder {
    [key: string]: number | string;
    total: number;
}

interface DashboardDailyResponse {
    orders: DashboardDailyOrder[];
    totalOrders: number;
    quantityOrders: number | undefined;
}