
export interface CatalogueResponse {
  id: string;
  name: string;
  description: string;
  state: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}