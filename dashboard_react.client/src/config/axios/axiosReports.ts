import axios from "axios";

import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../../util/errors";
import { URl_REPORTS } from "../contants";
import { InitialAuth } from "../../types/InitialAuth";

export const reports = axios.create({
  baseURL: URl_REPORTS,
  headers: {
    "Content-Type": "application/json",
    common: {
      Accept: "application/json",
      Authorization: "",
      "Content-Type": "application/json",
    },
    Authorization: "",
  },
});

reports.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response.status === 401) {
      throw new UnauthorizedError(
        "Tu sesión ha expirado vuelve a iniciar sesión",
      );
    } else if (response.status == 400) {
      return response.data;
    } else if (response.status == 403) {
      throw new ForbiddenError(
        "No tienes permisos para realizar esta acción contacta con el administrador",
      );
    } else if (response.status == 500) {
      throw new InternalServerError(
        "Hubo un error en el servidor, Notifica al desarrollador",
      );
    }

    return response;
  },
);

reports.interceptors.request.use((config) => {
  if (
    config.headers.Authorization === undefined ||
    config.headers.Authorization === "" ||
    config.headers.Authorization === null ||
    config.headers.Authorization === "Bearer "
  ) {
    const storedState = window.localStorage.getItem("@auth");

    if (storedState) {
      const { token }: InitialAuth = JSON.parse(storedState);

      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const setReportAuthorization = (token: string) => {
  if (token !== undefined || token !== null) {
    reports.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    reports.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    reports.defaults.headers.common["Authorization"] = token;
    reports.defaults.headers.Authorization = token;
  }
};
