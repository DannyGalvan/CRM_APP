import { Authorizations } from "./Authorizations";


export interface AuthResponse {
  name: string;
  userName: string;
  email: string;
  token: string;
  redirect: string;
  userId: string;
  operations: Authorizations[];
}

export interface ApiResponse<T> {
  data: T | null;
  success: boolean | null;
  message: string | null;
  totalResults: number
}

