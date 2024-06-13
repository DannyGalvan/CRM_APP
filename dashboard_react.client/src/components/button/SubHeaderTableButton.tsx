import { Button, Tooltip } from '@nextui-org/react'
import { Icon } from '../Icons/Icon'


interface SubHeaderTableButtonProps {
   onClick: () => void 
  }

export const SubHeaderTableButton = ({
 onClick
}: SubHeaderTableButtonProps) => {
  return (
    <Tooltip
    content="Campos Visibles"
    placement="top"
    delay={0}
    closeDelay={0}
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
  >
    <Button
      className="bg-transparent text-white"
      radius="sm"
      type="button"
      isIconOnly
      onClick={onClick}
    >
      <Icon name="bi bi-three-dots-vertical" />
    </Button>
  </Tooltip>
  )
}
