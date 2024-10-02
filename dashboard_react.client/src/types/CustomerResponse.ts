import { SearchCatalogue } from "./Catalogue";
import { CatalogueResponse } from "./CatalogueResponse";

export interface CustomerResponse extends SearchCatalogue {
  id: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  fullName: string;
  firstPhone: string;
  secondPhone: string;
  shippingFee: string;
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
