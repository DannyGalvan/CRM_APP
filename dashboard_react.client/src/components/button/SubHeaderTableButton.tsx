import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";

import { Icon } from "../Icons/Icon";

interface SubHeaderTableButtonProps {
  onClick: () => void;
}

export const SubHeaderTableButton = ({
  onClick,
}: SubHeaderTableButtonProps) => {
  return (
    <Tooltip
      closeDelay={0}
      content="Campos Visibles"
      delay={0}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: "easeOut",
            },
          },
        },
      }}
      placement="top"
    >
      <Button
        isIconOnly
        className="bg-transparent text-white"
        radius="sm"
        type="button"
        onClick={onClick}
      >
        <Icon name="bi bi-three-dots-vertical" />
      </Button>
    </Tooltip>
  );
};
