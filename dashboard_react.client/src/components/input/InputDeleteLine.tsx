import { Button } from "@nextui-org/button";

import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { Icon } from "../Icons/Icon";

interface InputDeleteLineProps {
  data: any;
}

export const InputDeleteLine = ({ data }: InputDeleteLineProps) => {
  const { remove } = useOrderDetailStore();

  return (
    <Button isIconOnly color="danger" onClick={() => remove(data.id)}>
      <Icon color="" name="bi bi-trash" />
    </Button>
  );
};
