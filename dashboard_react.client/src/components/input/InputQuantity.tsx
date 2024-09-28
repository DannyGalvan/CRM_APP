import { Input } from "@nextui-org/input";
import { FocusEvent, FocusEventHandler, useState } from "react";

import { useOrderDetailStore } from "../../store/useOrderDetailStore";

interface InputQuantityProps {
  data: any;
}

export const InputQuantity = ({ data }: InputQuantityProps) => {
  const [quantity, setQuantity] = useState(data.quantity);
  const { changeQuantity, changeLoad } = useOrderDetailStore();

  const handleBlur: FocusEventHandler<HTMLInputElement> &
    ((e: FocusEvent<Element, Element>) => void) = (e: any) => {
    changeLoad();
    changeQuantity(data.id, parseInt(e.target.value ?? "0"));
  };

  const handleChange = (e: FocusEvent<HTMLInputElement>) => {
    setQuantity(parseInt(!e.target.value ? "0" : e.target.value));
  };

  return (
    <div>
      <Input
        min={0}
        step={1}
        type="number"
        value={quantity}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
};
