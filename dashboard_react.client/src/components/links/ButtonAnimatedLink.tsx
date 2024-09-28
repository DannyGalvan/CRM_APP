import { useNavigate } from "react-router-dom";
import { transitionViewIfSupported } from "../../util/viewTransition";
import { Button } from "@nextui-org/button";

interface ButtonAnimatedLinkProps {
  className?: string;
  to: string;
  children: React.ReactNode;
  color?: "primary" | "default" | "secondary" | "success" | "warning" | "danger";
}

export const ButtonAnimatedLink = ({ to, className, children, color = "primary" }: ButtonAnimatedLinkProps) => {
  const navigate = useNavigate();

  return (
    <Button
      href={to}
      className={className}
      color={color}
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
