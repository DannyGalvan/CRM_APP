import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Icon } from "../components/Icons/Icon";
import { AnimatedLink } from "../components/links/AnimatedLink";
import { SubMenu } from "../components/links/SubMenu";
import { URL_LOGO, nameRoutes } from "../config/contants";
import { useAuth } from "../hooks/useAuth";

const animationConfigPhone = {
  open: {
    x: 0,
    width: "16rem",
    transition: {
      damping: 40,
    },
  },
  closed: {
    x: -250,
    width: 0,
    transition: {
      damping: 40,
      delay: 0.15,
    },
  },
};

const animationConfigDesktop = {
  open: {
    width: "16rem",
    transition: {
      damping: 40,
    },
  },
  closed: {
    width: "4rem",
    transition: {
      damping: 40,
    },
  },
};

export const Sidebar = () => {
  const iconColor = "";
  const isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(
    localStorage.getItem("openSidebar") === "true",
  );
  const sidebarRef = useRef<HTMLDivElement>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { operations, logout, email, name } = useAuth();

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
      localStorage.setItem("openSidebar", "false");
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? animationConfigPhone
    : animationConfigDesktop;

  return (
    <div className="shadow-[13px_2px_22px_4px_#a0aec0]">
      <div
        className={`fixed inset-0 z-[47] max-h-screen md:hidden ${
          open ? "block" : "hidden"
        } `}
        onClick={() => setOpen(false)}
      />
      <motion.div
        ref={sidebarRef as RefObject<HTMLDivElement> | null}
        animate={open ? "open" : "closed"}
        className="        fixed
        z-[48] h-screen w-[16rem]
max-w-[16rem] overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black text-white shadow-xl  md:relative 
"
        initial={{ x: isTabletMid ? -250 : 0 }}
        variants={Nav_animation}
      >
        <Link
          className="flex gap-2.5 justify-center items-center py-3 mx-3 font-medium border-b border-slate-300"
          to={nameRoutes.root}
        >
          <img
            alt=""
            className={`${
              !open ? "w-100 height-10" : "w-25 height-24"
            } rounded-xl `}
            src={URL_LOGO}
          />
        </Link>

        <div className="flex h-full flex-col">
          <ul className="flex h-[70%] flex-col gap-1 overflow-x-hidden whitespace-pre px-2.5 py-5 text-[0.9rem] font-medium scrollbar-thin scrollbar-track-indigo-700 md:h-[68%]">
            <li>
              <AnimatedLink className="link" to={nameRoutes.root}>
                <Icon color={iconColor} name="bi bi-graph-up-arrow" size={23} />
                Dashboard
              </AnimatedLink>
            </li>
            <li>
              <AnimatedLink className="link" to={nameRoutes.calendar}>
                <Icon color={iconColor} name="bi bi-calendar-week" size={23} />
                Calendario
              </AnimatedLink>
            </li>
            {(open || isTabletMid) && (
              <div className="border-y border-slate-300 py-3">
                <small className="mb-2 inline-block pl-3 text-slate-500">
                  Mantenimientos
                </small>
                {operations?.map((menu) => (
                  <div key={menu.module.path} className="flex flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <AnimatedLink className="link" to={nameRoutes.settings}>
                <Icon color={iconColor} name="bi bi-gear" size={23} />
                Cambiar Contraseña
              </AnimatedLink>
            </li>
            <li>
              <a
                className="font-bold text-red-600 link"
                href="#"
                onClick={() => {
                  logout();
                  navigate(nameRoutes.login);
                }}
              >
                <Icon color={"red"} name="bi bi-box-arrow-left" size={23} />
                Salir
              </a>
            </li>
          </ul>
          {open && (
            <div className="z-50 my-auto max-h-48 w-full flex-1 whitespace-pre text-sm font-medium">
              <div className="flex flex-col items-center justify-between gap-2 border-y border-slate-300 p-2">
                <p className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-black">
                  {name}
                </p>
                <p className="rounded-xl bg-teal-50 px-2 py-1.5 text-xs font-bold text-black">
                  {email}
                </p>
              </div>
            </div>
          )}
        </div>
        <motion.div
          animate={
            open
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -200,
                  rotate: 180,
                }
          }
          className="hidden md:block absolute right-2 bottom-12 z-50 cursor-pointer h-fit w-fit"
          transition={{ duration: 0.3 }}
          onClick={() => {
            setOpen(!open);
            localStorage.setItem("openSidebar", open ? "false" : "true");
          }}
        >
          <Icon name="bi bi-caret-left-fill" size={25} />
        </motion.div>
      </motion.div>
      <div
        className="absolute z-[46] w-full bg-white p-3 md:hidden"
        onClick={() => {
          setOpen(!open);
          localStorage.setItem("openSidebar", open ? "false" : "true");
        }}
      >
        <Icon color={"black"} name="bi bi-list" size={25} />
      </div>
    </div>
  );
};
