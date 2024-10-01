import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { OrderStates, QueryKeys } from "../../config/contants";
import { useDrawer } from "../../hooks/useDrawer";
import { partialUpdateOrder } from "../../services/orderService";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { OrderResponse } from "../../types/OrderResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";

interface CatalogueActionMenuProps {
  data: OrderResponse;
}

export const OrderActionMenu = ({ data }: CatalogueActionMenuProps) => {
  const client = useQueryClient();
  const { setOpenUpdate } = useDrawer();
  const { updateDetails } = useOrderDetailStore();
  const { add } = useOrderStore();

  const handleOpen = () => {
    data.createdAt = null;
    data.updatedAt = null;
    data.updatedBy = null;
    data.createdBy = null;
    updateDetails(data.orderDetails);
    setOpenUpdate();
    add(data);
  };

  const handleDelete = async () => {
    const response = await partialUpdateOrder({
      id: data.id,
      orderStateId: OrderStates.deleted,
    });

    if (!response.success) {
      const errors = response.data as ValidationFailure[];
      errors.forEach((error: ValidationFailure) => {
        toast.error(error.errorMessage);
      });
    } else {
      await client.invalidateQueries({
        queryKey: [QueryKeys.Orders],
        type: "all",
        exact: false,
      });

      await client.invalidateQueries({
        queryKey: [QueryKeys.Products],
        type: "all",
        exact: false,
      });

      toast.success("Orden eliminada correctamente");
    }
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
          onClick={() => copyToClipboard(data.id)}
        >
          Copiar
        </DropdownItem>
        <DropdownItem
          key="edit"
          className="text-success"
          color="success"
          startContent={<Icon name="bi bi-pen" />}
          onClick={handleOpen}
        >
          Editar
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
