import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";

export const PublicRoutes: RouteObject[] = [
  {
    index: true,
    lazy: () => import("../pages/public/DashboardPage"),
  },
  {
    path: nameRoutes.calendar,
    lazy: () => import("../pages/public/CalendarPage"),
  },
  {
    path: nameRoutes.login,
    lazy: () => import("../pages/auth/LoginPage"),
  },
  {
    path: nameRoutes.changePassword,
    lazy: () => import("../pages/auth/ChangePasswordPage"),
  },
];
