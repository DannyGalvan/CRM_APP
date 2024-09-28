import { RouteObject } from "react-router-dom";

import { nameRoutes } from "../config/contants";
import { CreateCashReportPage } from "../pages/cashReport/CreateCashReportPage";
import { CashReportPage } from "../pages/cashReport/CashReportPage";

export const CashReportRoutes: RouteObject[] = [
  {
    path: nameRoutes.cashReport,
    element: <CashReportPage />,
  },
  {
    path: `${nameRoutes.cashReport}/${nameRoutes.create}`,
    element: <CreateCashReportPage />,
  },
];
