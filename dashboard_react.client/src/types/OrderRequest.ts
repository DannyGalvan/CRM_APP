
export interface OrderRequest {
  id?: string;
  customerId: string;
  paymentTypeId: string;
  orderStateId: string;
  orderDetails: OrderDetailRequest[];
}

export interface OrderDetailRequest {
  numberLine: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}