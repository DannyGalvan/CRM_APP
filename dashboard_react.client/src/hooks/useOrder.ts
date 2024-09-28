import { useQueryClient } from "@tanstack/react-query";
import { createOrder, updateOrder } from "../services/orderService";
import { useOrderDetailStore } from "../store/useOrderDetailStore";
import { OrderRequest } from "../types/OrderRequest";
import { rebootScroll } from "../util/viewTransition";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";
import { useOrderStore } from "../store/useOrderStore";
import { useRangeOfDatesStore } from "../store/useRangeOfDatesStore";

export const useOrder = () => {
  const client = useQueryClient();
  const { filters } = useOrderStore();
  const { end, start } = useRangeOfDatesStore();
  const { orderDetail, clear } = useOrderDetailStore();

  const rebootCatalogues = () => {
    updateSearch(QueryKeys.Customers, "");
    updateSearch(QueryKeys.CustomerDirections, "");
    updateSearch(QueryKeys.PaymentTypes, "");
    updateSearch(QueryKeys.Products, "");
    updateSearch("Reminder", "0.00");
  };

  const reboolQueries = async () => {
    await client.invalidateQueries({
      queryKey: [
        QueryKeys.Orders,
        filters.filter,
        end,
        start,
        filters.page,
        filters.pageSize,
      ],
      type: "all",
      exact: true,
    });

    await client.refetchQueries({
      queryKey: [QueryKeys.OrdersFiltered],
      type: "all",
      exact: true,
    });

    await client.refetchQueries({
      queryKey: [QueryKeys.Products],
      type: "all",
      exact: false,
    });

    rebootScroll();
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

      await reboolQueries();
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

    await reboolQueries();

    return response;
  };

  return {
    create,
    update,
  };
};
