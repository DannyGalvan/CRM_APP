import { RouteObject } from "react-router-dom";

import { nameRoutes } from "../config/contants";
import { CustomerCreatePage } from "../pages/customer/CustomerCreatePage";
import { CustomerPage } from "../pages/customer/CustomerPage";

export const CustomerRoutes: RouteObject[] = [
  {
    path: nameRoutes.customer,
    element: <CustomerPage />,
  },
  {
    path: `${nameRoutes.customer}/${nameRoutes.create}`,
    element: <CustomerCreatePage />,
  },
];
