
export interface OrderRequest {
  id?: string;
  deliveryDate?: Date;
  customerId?: string;
  paymentTypeId?: string;
  orderStateId?: string;
  orderDetails?: OrderDetailRequest[];
}

export interface OrderDetailRequest {
  numberLine: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}