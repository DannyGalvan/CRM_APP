import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useContext } from "react";
import { DrawerContext } from "../../context/DrawerContext";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";

interface CatalogueActionMenuProps {
  data: any;
  useStore: any;
}

export const CatalogueActionMenu = ({ data, useStore }: CatalogueActionMenuProps) => {
  const { setOpenUpdate} = useContext(DrawerContext);
  const { add } = useStore();

  const handleOpen = () => {
    data.createdAt = null;
    data.updatedAt = null;
    data.updatedBy = null;
    data.createdBy = null;
    add(data);
    setOpenUpdate();
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
          onClick={() => copyToClipboard(data.id)}
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
