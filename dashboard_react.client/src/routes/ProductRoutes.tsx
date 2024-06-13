import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { CreateProductPage } from "../pages/product/CreateProductPage";

export const ProductRoutes: RouteObject[] = [
  {
    path: nameRoutes.product,
    children: [
      {
        path: nameRoutes.create,
        element: <CreateProductPage />,
      },
    ],
  },
];