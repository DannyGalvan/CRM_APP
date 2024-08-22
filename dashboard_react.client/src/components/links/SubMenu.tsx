import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Authorizations } from "../../types/Authorizations";
import { Icon } from "../Icons/Icon";
import { AnimatedLink } from "./AnimatedLink";

interface subMenuProps {
  data: Authorizations;
}

export const SubMenu = ({ data }: subMenuProps) => {
  const iconColor = "";
  const { pathname } = useLocation();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <li
        className={`link ${
          pathname.includes(data.module.path) && "text-sky-500"
        }`}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <Icon color={iconColor} size={23} name={data.module.image} />
        <p className="flex-1 text-wrap capitalize">{data.module.name}</p>
        <motion.i
          animate={
            subMenuOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  rotate: 90,
                }
          }
        >
          <Icon color={iconColor} name={`bi bi-chevron-down`} size={15} />
        </motion.i>
      </li>
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "auto",
              }
            : {
                height: 0,
              }
        }
        className="flex h-0 flex-col overflow-hidden pl-8 text-[0.8rem] font-normal"
      >
        {data.operations?.map(
          (menu) =>
            menu.isVisible && (
              <li key={menu.id}>
                <AnimatedLink
                  to={`${menu.path}`}
                  className="link text-wrap capitalize"
                >
                   <Icon color={iconColor} size={18} name={menu.icon} />
                  {menu.name}
                </AnimatedLink>
              </li>
            ),
        )}
      </motion.ul>
    </>
  );
};