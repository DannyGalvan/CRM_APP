import { CatalogueResponse } from "./CatalogueResponse";
import { CustomerAddressResponse } from "./CustomerAddressResponse";
import { CustomerResponse } from "./CustomerResponse";
import { ProductResponse } from "./ProductResponse";

export interface OrderResponse {
  id: string;
  customerId: string;
  customerDirectionId: string;
  orderDate: Date;
  deliveryDate: any;
  paymentTypeId: string;
  orderStateId: string;
  total: number;
  orderDetails: OrderDetailResponse[];
  createdAt: string | null;
  updatedAt?: string | null;
  createdBy: string | null;
  updatedBy?: string | null;
  customer: CustomerResponse;
  customerDirection: CustomerAddressResponse;
  paymentType: CatalogueResponse;
  orderState: CatalogueResponse;
}

export interface OrderDetailResponse {
  numberLine: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalLine: number;
  product: ProductResponse;
}

export interface OrderDetailLine {
  id: string;
  numberLine: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalLine: number;
}

export interface OrderDetailLineRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}
