import { InitialAuth } from "../types/InitialAuth";

export const URL_FETCH_EVENTS = "/api/v1/event";

export const URL_LOGO = "/OIG3.webp";

export const URL_API = "/api/v1";

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
  create: "create",
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

export const MONTHS : Record<number,string> = {
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
