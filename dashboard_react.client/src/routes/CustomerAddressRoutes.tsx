import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { AddressCreatePage } from "../pages/customer/address/AddressCreatePage";
import { AddressPage } from "../pages/customer/address/AddressPage";

export const CustomerAddressRoutes: RouteObject[] = [
  {
    path: `${nameRoutes.customer}${nameRoutes.address}`,
    element: <AddressPage />,
  },
  {
    path: `${nameRoutes.customer}${nameRoutes.address}/${nameRoutes.create}`,
    element: <AddressCreatePage />,
  },
];
