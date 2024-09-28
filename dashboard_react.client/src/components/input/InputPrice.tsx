import { Input } from "@nextui-org/input";
import { FocusEvent, FocusEventHandler, useState } from "react";

import { useOrderDetailStore } from "../../store/useOrderDetailStore";

interface InputPriceProps {
  data: any;
}

export const InputPrice = ({ data }: InputPriceProps) => {
  const [price, setPrice] = useState(data.unitPrice);
  const { changeUnitPrice, changeLoad } = useOrderDetailStore();

  const handleBlur: FocusEventHandler<HTMLInputElement> &
    ((e: FocusEvent<Element, Element>) => void) = (e: any) => {
    changeLoad();
    changeUnitPrice(data.id, parseFloat(e.target.value ?? "0"));
  };

  const handleChange = (e: FocusEvent<HTMLInputElement>) => {
    setPrice(parseFloat(!e.target.value ? "0" : e.target.value));
  };

  return (
    <div>
      <Input
        min={0}
        step={0.01}
        type="number"
        value={price}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
};
