import { CatalogueResponse } from "./CatalogueResponse";

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  familyId: string;
  cost: number;
  salePrice: number;
  stock: number;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  family: CatalogueResponse;
}