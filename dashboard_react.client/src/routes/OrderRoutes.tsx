import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { CreateOrderPage } from "../pages/orders/CreateOrderPage";
import { OrderPage } from "../pages/orders/OrderPage";


export const OrderRoutes: RouteObject[] = [
  {
    path: nameRoutes.order,
    element: <OrderPage />,
  },
  {
    path: `${nameRoutes.order}/${nameRoutes.create}`,
    element: <CreateOrderPage />,
  }
];