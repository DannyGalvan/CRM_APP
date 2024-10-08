import { ModalType } from "../hooks/useModalStrategies";
import { InitialAuth, ReportState } from "../types/InitialAuth";

export const URL_FETCH_EVENTS = "/api/v1/event";

export const URL_LOGO = "/OIG3.webp";

export const URL_API = "/api/v1";

export const URl_REPORTS = "/reports";

export const authInitialState: InitialAuth = {
  isLoggedIn: false,
  redirect: false,
  email: "",
  token: "",
  userName: "",
  name: "",
  userId: "",
  operations: [],
};

export const reportInitialState: ReportState = {
  name: "",
  userName: "",
  email: "",
  token: "",
  userId: "",
};

export const nameRoutes = {
  login: "/auth",
  calendar: "/calendar",
  changePassword: "/change-password",
  settings: "/change-password",
  root: "/",
  notFound: "*",
  forbidden: "/forbidden",
  unauthorized: "/unauthorized",
  error: "/error",
  collection: "/collection",
  customer: "/customer",
  catalogue: "/catalogue",
  product: "/product",
  order: "/order",
  pilot: "/pilot",
  route: "/route",
  address: "/direction",
  cashReport: "/cashreport",
  create: "create",
};

export type KeyType =
  | "Catalogues"
  | "Orders"
  | "Routes"
  | "CashReports"
  | "OrdersHasRoute"
  | "Collections"
  | "OrdersFiltered";

export const QueryKeys: Record<ModalType | KeyType, ModalType | KeyType> = {
  Customers: "Customers",
  Pilots: "Pilots",
  Catalogues: "Catalogues",
  Products: "Products",
  Municipalities: "Municipalities",
  Zones: "Zones",
  Departments: "Departments",
  CustomerDirections: "CustomerDirections",
  PaymentTypes: "PaymentTypes",
  Families: "Families",
  Orders: "Orders",
  Routes: "Routes",
  CashReports: "CashReports",
  OrdersHasRoute: "OrdersHasRoute",
  OrdersFiltered: "OrdersFiltered",
  Collections: "Collections",
  "": "",
};

export const OrderStates = {
  create: "667a0b4ea82250a2c13748c2",
  hasRoute: "667a0b58a82250a2c13748c3",
  dispatched: "667a0b64a82250a2c13748c4",
  delivered: "667a0b72a82250a2c13748c5",
  deleted: "66d4e2be0cb8112b950ab12f",
};

export const PAGINATION_OPTIONS = {
  rowsPerPageText: "Elementos Por Pagina",
  rangeSeparatorText: "de",
  selectAllRowsItem: false,
  selectAllRowsItemText: "Todos",
};

export const SELECTED_MESSAGE = {
  singular: "Elemento",
  plural: "Elementos",
  message: "Seleccionado(s)",
};

export const DEFAULT_CATALOGUE = "Catalogos";
export const invalid_type_error = "El tipo provisto es invalido";
export const required_error = "El campo es requerido";

export const MONTHS: Record<number, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};
