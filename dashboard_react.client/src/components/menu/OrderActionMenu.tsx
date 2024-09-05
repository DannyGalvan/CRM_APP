import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useContext } from "react";
import { DrawerContext } from "../../context/DrawerContext";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { OrderResponse } from "../../types/OrderResponse";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";
import { partialUpdateOrder } from "../../services/orderService";
import { ValidationFailure } from "../../types/ValidationFailure";
import { toast } from "react-toastify";

interface CatalogueActionMenuProps {
  data: OrderResponse;
}

export const OrderActionMenu = ({ data }: CatalogueActionMenuProps) => {
  const { setOpenUpdate } = useContext(DrawerContext);
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
      id: data.id!,
      orderStateId: "66d4e2be0cb8112b950ab12f",
    });

    if (!response.success) {
      const errors = response.data as ValidationFailure[];
      errors.forEach((error: ValidationFailure) => {
        toast.error(error.errorMessage);
      });
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="bg-transparent text-cyan-500" isIconOnly>
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
          key="edit"
          className="text-success"
          color="success"
          onClick={handleOpen}
          startContent={<Icon name="bi bi-pen" />}
        >
          Editar
        </DropdownItem>
        <DropdownItem
          key="delete"
          onClick={handleDelete}
          startContent={<Icon name="bi bi-trash3" />}
          className="text-danger"
          color="danger"
          content="Eliminar"
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
