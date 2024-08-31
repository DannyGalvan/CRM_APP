import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { PilotPage } from "../pages/pilots/PilotPage";
import { CreatePilotPage } from "../pages/pilots/CreatePilotPage";

export const PilotRoutes: RouteObject[] = [
  {
    path: nameRoutes.pilot,
    element: <PilotPage />,
  },
  {
    path: `${nameRoutes.pilot}/${nameRoutes.create}`,
    element: <CreatePilotPage />,
  }
];