export interface ProductRequest {
  id?: string;
  name: string;
  description: string;
  familyId: string;
  cost: number;
  salePrice: number;
  stock: number;
  state?: number;
}
