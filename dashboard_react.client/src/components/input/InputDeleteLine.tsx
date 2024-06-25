import { Button } from "@nextui-org/react";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { Icon } from "../Icons/Icon";

interface InputDeleteLineProps {
  data: any;
}

export const InputDeleteLine = ({ data }: InputDeleteLineProps) => {
  const { remove } = useOrderDetailStore();

  return (
    <Button color="danger" isIconOnly onClick={() => remove(data.id)}>
      <Icon name="bi bi-trash" color="" />
    </Button>
  );
};
