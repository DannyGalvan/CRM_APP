import { v4 } from "uuid";
import { create } from "zustand";

import { OrderDetailRequest } from "../types/OrderRequest";
import {
  OrderDetailLine,
  OrderDetailLineRequest,
} from "../types/OrderResponse";

interface OrderDetailState {
  load: boolean;
  orderDetail: OrderDetailLine[];
  add: (orderDetail: OrderDetailLineRequest) => boolean;
  remove: (id: string) => boolean;
  total: () => number;
  changeQuantity: (id: string, quantity: number) => boolean;
  changeUnitPrice: (id: string, unitPrice: number) => boolean;
  changeLoad: (time?: number) => void;
  clear: () => void;
  updateDetails: (orderDetails: OrderDetailRequest[]) => void;
}

export const useOrderDetailStore = create<OrderDetailState>((set, get) => ({
  orderDetail: [],
  add: (orderDetailRequest) => {
    if (orderDetailRequest.productId === undefined) {
      return false;
    }

    const orderDetail: OrderDetailLine = {
      ...orderDetailRequest,
      id: v4(),
      numberLine: get().orderDetail.length + 1,
      totalLine: orderDetailRequest.quantity * orderDetailRequest.unitPrice,
    };

    if (
      get().orderDetail.find((od) => od.productId === orderDetail.productId)
    ) {
      return false;
    }

    const newOrderDetail = [...get().orderDetail, orderDetail];

    set({ orderDetail: newOrderDetail });

    return true;
  },
  remove: (id) => {
    const newOrderDetail = get().orderDetail.filter(
      (orderDetail) => orderDetail.id !== id,
    );

    set({ orderDetail: newOrderDetail });

    return true;
  },
  total: () => {
    return get().orderDetail.reduce(
      (acc: number, orderDetail: OrderDetailLine) => {
        return acc + orderDetail.totalLine;
      },
      0,
    );
  },
  changeQuantity: (id, quantity) => {
    const newQuantity = quantity < 0 || !quantity ? 0 : quantity;
    const newOrderDetail = get().orderDetail.map((orderDetail) => {
      if (orderDetail.id === id) {
        orderDetail.quantity = newQuantity;
        orderDetail.totalLine = parseFloat(
          (orderDetail.quantity * orderDetail.unitPrice).toFixed(2),
        );
      }

      return orderDetail;
    });

    set({ orderDetail: newOrderDetail });

    return true;
  },
  changeUnitPrice: (id, unitPrice) => {
    const newUnitPrice = unitPrice < 0 || !unitPrice ? 0 : unitPrice;
    const newOrderDetail = get().orderDetail.map((orderDetail) => {
      if (orderDetail.id === id) {
        orderDetail.unitPrice = newUnitPrice;
        orderDetail.totalLine = parseFloat(
          (orderDetail.quantity * orderDetail.unitPrice).toFixed(2),
        );
      }

      return orderDetail;
    });

    set({ orderDetail: newOrderDetail });

    return true;
  },
  changeLoad: (time = 50) => {
    set({ load: !get().load });
    setTimeout(() => {
      set({ load: !get().load });
    }, time);
  },
  load: false,
  clear: () => {
    set({ orderDetail: [] });
  },
  updateDetails: (orderDetails) => {
    const newOrderDetail = orderDetails.map((detail, index) => ({
      ...detail,
      id: v4(),
      numberLine: index + 1,
      totalLine: parseFloat((detail.quantity * detail.unitPrice).toFixed(2)),
    }));

    set({ orderDetail: newOrderDetail });
  },
}));
