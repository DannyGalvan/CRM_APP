import { useQueryClient } from "@tanstack/react-query";
import { createOrder, updateOrder } from "../services/orderService";
import { useOrderDetailStore } from "../store/useOrderDetailStore";
import { useOrderStore } from "../store/useOrderStore";
import { ApiResponse } from "../types/ApiResponse";
import { OrderRequest } from "../types/OrderRequest";
import { OrderResponse } from "../types/OrderResponse";

interface RangeOfDates {
  start: string;
  end: string;
}

export const useOrder = (rangeOfDates?: RangeOfDates) => {
  const client = useQueryClient();
  const { orderDetail, clear } = useOrderDetailStore();
  const { add } = useOrderStore();

  const create = async (form: OrderRequest) => {
    const orderDetails = orderDetail.map((detail) => ({
      numberLine: detail.numberLine,
      productId: detail.productId,
      productName: detail.productName,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
    }));
    form.orderDetails = orderDetails;

    const response = await createOrder(form);

    if (response.success) {
      clear();
    }

    await client.refetchQueries({
      queryKey: ["ordersFiltered"],
      type: "all",
      exact: false,
    });

    return response;
  };

  const update = async (form: OrderRequest) => {
    const orderDetails = orderDetail.map((detail) => ({
      numberLine: detail.numberLine,
      productId: detail.productId,
      productName: detail.productName,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
    }));
    form.orderDetails = orderDetails;

    const response = await updateOrder(form);

    if (!response.success) {
      return response;
    }

    await client.invalidateQueries({
      queryKey: ["orders"],
      type: "active",
      exact: false,
    });

    const orders = client.getQueryData<ApiResponse<OrderResponse[]>>([
      "orders",
      rangeOfDates!.start,
      rangeOfDates!.end,
    ]);

    if (orders != undefined) {
      const find = orders.data?.find((c) => c.id === form.id);

      if (find != undefined) {
        const newOrder = {
          ...find,
          createdAt: null,
          updatedAt: null,
          updatedBy: null,
          createdBy: null,
        };

        find && add(newOrder);
      }
    }

    await client.refetchQueries({
      queryKey: ["ordersFiltered"],
      type: "all",
      exact: false,
    });

    return response;
  };

  return {
    create,
    update,
  };
};
