import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useContext } from "react";
import { DrawerContext } from "../../context/DrawerContext";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";
import { RouteResponse } from "../../types/RouteResponse";
import { useRouteStore } from "../../store/useRouteStore";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { getRouteDetails } from "../../services/routeDetailService";

interface CatalogueActionMenuProps {
  data: RouteResponse;
}

export const RouteActionMenu = ({ data }: CatalogueActionMenuProps) => {
  const { setOpenUpdate } = useContext(DrawerContext);
  const { add: addDetail } = useRouteDetailStore();
  const { add: addRoute } = useRouteStore();

  const handleOpen = async () => {
    data.createdAt = null;
    data.updatedAt = null;
    data.updatedBy = null;
    data.createdBy = null;
    setOpenUpdate();

    addRoute({
      ...data,
      details: [],
    });

    const details = await getRouteDetails(`RouteId:eq:${data.id}`);

    addDetail(details.data!);
  };

  const handleDelete = async () => {};

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
