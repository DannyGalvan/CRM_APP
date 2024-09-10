import { CustomerResponse } from "./CustomerResponse";

export interface CustomerAddressResponse {
  id: string;
  customerId: string;
  departmentId: string;
  municipalityId: string;
  zoneId: string;
  colonyCondominium: string;
  address: string;
  createdBy: string | null;
  updatedBy?: string | null;
  createdAt: string | null;
  updatedAt?: string | null;
  customer: CustomerResponse;
  department: CatalogueRequest;
  municipality: CatalogueRequest;
  zone: CatalogueRequest;
}
