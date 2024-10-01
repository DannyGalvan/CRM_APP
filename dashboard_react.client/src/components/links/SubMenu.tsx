/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
        <Icon color={iconColor} name={data.module.image} size={23} />
        <p className="flex-1 capitalize text-wrap">{data.module.name}</p>
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
        className="flex overflow-hidden flex-col pl-8 h-0 font-normal text-0.8rem"
      >
        {data.operations?.map(
          (menu) =>
            menu.isVisible && (
              <li key={menu.id}>
                <AnimatedLink
                  className="capitalize link text-wrap"
                  to={`${menu.path}`}
                >
                  <Icon color={iconColor} name={menu.icon} size={18} />
                  {menu.name}
                </AnimatedLink>
              </li>
            ),
        )}
      </motion.ul>
    </>
  );
};
