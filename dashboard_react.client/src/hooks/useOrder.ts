import { useQueryClient } from "@tanstack/react-query";
import { createOrder, updateOrder } from "../services/orderService";
import { useOrderDetailStore } from "../store/useOrderDetailStore";
import { useOrderStore } from "../store/useOrderStore";
import { ApiResponse } from "../types/ApiResponse";
import { OrderRequest } from "../types/OrderRequest";
import { OrderResponse } from "../types/OrderResponse";
import { rebootScroll } from "../util/viewTransition";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";

interface RangeOfDates {
  start: string;
  end: string;
}

export const useOrder = (rangeOfDates?: RangeOfDates) => {
  const client = useQueryClient();
  const { orderDetail, clear } = useOrderDetailStore();
  const { add } = useOrderStore();

  const rebootCatalogues = () => {
    updateSearch(QueryKeys.Customers, "");
    updateSearch(QueryKeys.CustomerDirections, "");
    updateSearch(QueryKeys.PaymentTypes, "");
    updateSearch(QueryKeys.Products, "");
    updateSearch("Reminder", "0.00");
  };

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

      rebootCatalogues();

      await client.invalidateQueries({
        queryKey: [QueryKeys.Orders],
        type: "all",
        exact: false,
      });

      await client.refetchQueries({
        queryKey: [QueryKeys.OrdersFiltered],
        type: "all",
        exact: false,
      });

      await client.refetchQueries({
        queryKey: [QueryKeys.Products],
        type: "all",
        exact: false,
      });

      rebootScroll();
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

    if (!response.success) {
      return response;
    }

    rebootScroll();

    await client.invalidateQueries({
      queryKey: [QueryKeys.Orders],
      type: "all",
      exact: false,
    });

    await client.refetchQueries({
      queryKey: [QueryKeys.Products],
      type: "all",
      exact: false,
    });

    const orders = client.getQueryData<ApiResponse<OrderResponse[]>>([
      QueryKeys.Orders,
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
      queryKey: [QueryKeys.OrdersFiltered],
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
