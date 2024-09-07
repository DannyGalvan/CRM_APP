import { HttpStatusCode } from "./StatusCode";

export interface AppError {
  statusCode: HttpStatusCode;
  message: string;
  name: string;
}
