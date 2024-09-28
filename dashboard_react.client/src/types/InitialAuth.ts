import { Authorizations } from "./Authorizations";

export interface InitialAuth {
  isLoggedIn: boolean;
  email: string;
  redirect: boolean;
  userName: string;
  name: string;
  token: string;
  userId: string;
  operations: Authorizations[];
}

export interface ReportState {
  name: string;
  userName: string;
  email: string;
  token: string;
  userId: string;
}
