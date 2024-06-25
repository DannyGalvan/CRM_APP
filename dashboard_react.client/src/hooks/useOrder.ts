import { useQueryClient } from "@tanstack/react-query";
import { createOrder, updateOrder } from "../services/orderService";
import { useOrderDetailStore } from "../store/useOrderDetailStore";
import { useOrderStore } from "../store/useOrderStore";
import { ApiResponse } from "../types/ApiResponse";
import { OrderRequest } from "../types/OrderRequest";
import { OrderResponse } from "../types/OrderResponse";

export const useOrder = () => {
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

    await client.refetchQueries({
      queryKey: ["orders"],
      type: "active",
      exact: true,
    });

    const orders = client.getQueryData<ApiResponse<OrderResponse[]>>([
      "orders",
    ]);

    if (orders != undefined) {
      const find = orders.data?.find((c) => c.id === form.id);

      if (find != undefined) {
        find.createdAt = null;
        find.updatedAt = null;
        find.updatedBy = null;
        find.createdBy = null;
      }

      find && add(find);
    }

    return response;
  };

  return {
    create,
    update,
  };
};
