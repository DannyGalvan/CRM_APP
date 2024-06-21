import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { CollectionPage } from "../pages/collection/CollectionPage";
import { CreateCollectionPage } from "../pages/collection/CreateCollectionPage";

export const CollectionRoutes: RouteObject[] = [
  {
    path: nameRoutes.collection,
    element: <CollectionPage />,
  },
  {
    path: `${nameRoutes.collection}/${nameRoutes.create}`,
    element: <CreateCollectionPage />,
  }
];
