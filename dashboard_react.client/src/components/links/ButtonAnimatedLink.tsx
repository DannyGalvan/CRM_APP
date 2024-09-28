import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";

import { transitionViewIfSupported } from "../../util/viewTransition";

interface ButtonAnimatedLinkProps {
  className?: string;
  to: string;
  children: React.ReactNode;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export const ButtonAnimatedLink = ({
  to,
  className,
  children,
  color = "primary",
}: ButtonAnimatedLinkProps) => {
  const navigate = useNavigate();

  return (
    <Button
      className={className}
      color={color}
      href={to}
      onClick={(ev) => {
        ev.preventDefault();
        transitionViewIfSupported(() => {
          navigate(to);
        });
      }}
    >
      {children}
    </Button>
  );
};
