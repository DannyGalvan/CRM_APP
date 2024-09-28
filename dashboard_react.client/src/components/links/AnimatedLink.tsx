import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { transitionViewIfSupported } from "../../util/viewTransition";

interface AnimatedLinkProps {
  className: string;
  to: string;
  children: React.ReactNode;
}

export const AnimatedLink = ({
  className,
  to,
  children,
}: AnimatedLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(location.pathname === to);
  }, [location]);

  return (
    <a
      className={`${className} ${active ? "active" : ""}`}
      href={to}
      onClick={(ev) => {
        ev.preventDefault();
        transitionViewIfSupported(() => {
          navigate(to);
        });
      }}
    >
      {children}
    </a>
  );
};
