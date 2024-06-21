import { InitialAuth } from "../types/InitialAuth";

export const URL_FETCH_EVENTS = "/api/v1/event"

export const URL_LOGO = "/OIG3.webp"

export const URL_API = "/api/v1"

export const authInitialState : InitialAuth = {
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

