import { SearchCatalogue } from "./Catalogue";

export interface CatalogueResponse extends SearchCatalogue {
  id: string;
  name: string;
  description: string;
  state: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}
