import { reports } from "../config/axios/axiosReports";
import { LoginForm } from "../pages/auth/LoginPage";
import { ApiResponse } from "../types/ApiResponse";
import { ReportState } from "../types/InitialAuth";
import { ValidationFailure } from "../types/ValidationFailure";

export const loginReport = async (credentials: LoginForm) => {
  return await reports.post<
    any,
    ApiResponse<ReportState | ValidationFailure[]>,
    any
  >("/api/auth", credentials);
};

export const downloadFile = async (
  fileUrl: string,
  destinationFileName: string,
) => {
  try {
    const response = await reports.get<any, any>(fileUrl, {
      responseType: "blob", // Asegura que la respuesta se maneje como un Blob
    });

    const url = window.URL.createObjectURL(
      new Blob([response], { type: "application/pdf" }),
    );

    // Abrir el archivo en una nueva pestaña
    window.open(url, "_blank");

    console.log("Archivo descargado exitosamente", destinationFileName);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
};
