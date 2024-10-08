import { RouteObject } from "react-router-dom";

import { nameRoutes } from "../config/contants";
import { CreateProductPage } from "../pages/product/CreateProductPage";
import { ProductPage } from "../pages/product/ProductPage";

export const ProductRoutes: RouteObject[] = [
  {
    path: nameRoutes.product,
    element: <ProductPage />,
  },
  {
    path: `${nameRoutes.product}/${nameRoutes.create}`,
    element: <CreateProductPage />,
  },
];
