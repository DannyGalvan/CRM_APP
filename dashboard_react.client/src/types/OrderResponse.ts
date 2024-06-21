import { CatalogueResponse } from "./CatalogueResponse";
import { CustomerResponse } from "./CustomerResponse";
import { ProductResponse } from "./ProductResponse";

export interface OrderResponse {
  id?: string;
  customerId: string;
  orderDate: string;
  paymentTypeId: string;
  orderStateId: string;
  total: number;
  orderDetails: OrderDetalResponse[];
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  customer: CustomerResponse;
  paymentType: CatalogueResponse;
  orderState: CatalogueResponse;
}

export interface OrderDetalResponse {
  numberLine: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalLine: number;
  product: ProductResponse;
}