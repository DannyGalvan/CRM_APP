import { CatalogueResponse } from "./CatalogueResponse";

export interface CustomerResponse {
  id: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  fullName: string;
  firstPhone: string;
  secondPhone: string;
  address: string;
  departmentId: string;
  municipalityId: string;
  zoneId: string;
  colony_Condominium: string;
  socialNetworks: string;
  state: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  department?: CatalogueResponse;
  municipality?: CatalogueResponse;
  zone?: CatalogueResponse;
}