import { Module } from "./Modules";
import { Operations } from "./Operations";

export interface Authorizations {
  module: Module;
  operations: Operations[];
}
