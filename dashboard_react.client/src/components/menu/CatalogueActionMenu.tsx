import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";
import { useDrawer } from "../../hooks/useDrawer";

interface CatalogueActionMenuProps {
  data: any;
  useStore: any;
  deleteAction?: () => void;
}

export const CatalogueActionMenu = ({
  data,
  useStore,
}: CatalogueActionMenuProps) => {
  const { setOpenUpdate } = useDrawer();
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
        {/* <DropdownItem
          key="delete"
          startContent={<Icon name="bi bi-trash3" />}
          className="text-danger"
          color="danger"
          onClick={deleteAction}
          content="Eliminar"
        >
          Eliminar
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};
