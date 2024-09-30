import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";
import { RouteDetailsResponse } from "../../types/RouteDetailsResponse";
import { updateRouteDetail } from "../../services/routeDetailService";
import { partialUpdateOrder } from "../../services/orderService";
import { OrderStates, QueryKeys } from "../../config/contants";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { useErrorsStore } from "../../store/useErrorsStore";
import { ValidationFailure } from "../../types/ValidationFailure";

interface RouteDetailActionMenuProps {
  data: RouteDetailsResponse;
}

export const RouteDetailActionMenu = ({ data }: RouteDetailActionMenuProps) => {
  const { getRouteDetailsByRouteId } = useRouteDetailStore();
  const { setError } = useErrorsStore();
  const client = useQueryClient();

  const handleDelete = async () => {
    const response = await updateRouteDetail({
      orderId: data.orderId,
      routeId: data.routeId,
      id: data.id,
      state: 0,
    });

    if (!response.success) {
      toast.warning(response.message);

      const errors = response.data as ValidationFailure[];

      errors.forEach((error) => {
        toast.error(error.propertyName + " " + error.errorMessage);
      });

      return;
    }

    toast.success("Detalle de ruta eliminado");

    const updtateOrderDetail = await partialUpdateOrder({
      id: data.orderId,
      orderStateId: OrderStates.create,
    });

    if (!updtateOrderDetail.success) {
      toast.error(updtateOrderDetail.message);

      return;
    }

    getRouteDetailsByRouteId(data.routeId, setError);

    client.refetchQueries({
      queryKey: [QueryKeys.OrdersFiltered],
      type: "active",
      exact: true,
    });

    client.invalidateQueries({
      queryKey: [QueryKeys.Orders],
      type: "active",
      exact: false,
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly className="bg-transparent text-cyan-500">
          <Icon name="bi bi-three-dots-vertical" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="copy"
          startContent={<Icon name="bi bi-clipboard-check" />}
          onClick={() => copyToClipboard(data.id!)}
        >
          Copiar
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          content="Eliminar"
          startContent={<Icon name="bi bi-trash3" />}
          onClick={handleDelete}
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
