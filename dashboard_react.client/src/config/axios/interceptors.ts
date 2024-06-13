import axios from "axios";
import { ForbiddenError, InternalServerError, UnauthorizedError } from "../../util/errors";
import { URL_API } from "../contants";

export const api = axios.create({
    baseURL: URL_API,
    headers: {
        "Content-Type": "application/json",
    },
});

export const authorization = api.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response.status === 401) {
      throw new UnauthorizedError("Tu sesión ha expirado vuelve a iniciar sesión");
    } else if (response.status == 400) {
      return response.data;
    } else if (response.status == 403) {
      throw new ForbiddenError("No tienes permisos para realizar esta acción contacta con el administrador");
    } else if (response.status == 500) {
      throw new InternalServerError("Hubo un error en el servidor, Notifica al desarrollador");
    }

    return response.data;
  },
);

export const setAuthorization = (token : string) => {
  if (token !== undefined || token !== null) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    api.defaults.headers.common["Authorization"] = token;
  }
};
