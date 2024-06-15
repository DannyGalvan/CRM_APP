import { InitialAuth } from "../types/InitialAuth";

export const URL_FETCH_EVENTS = "/api/event"

export const URL_LOGO = "/OIG3.webp"

export const URL_API = "/api"

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

