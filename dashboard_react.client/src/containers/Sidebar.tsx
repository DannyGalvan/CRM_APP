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
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
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
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[47] max-h-screen md:hidden ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef as RefObject<HTMLDivElement> | null}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="fixed z-[48] h-screen w-[16rem] max-w-[16rem] overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-700  via-gray-900 
        to-black text-white shadow-xl
        md:relative"
      >
        <Link
          to={nameRoutes.root}
          className="mx-3 flex items-center justify-center gap-2.5 border-b border-slate-300 py-3 font-medium"
        >
          <img
            src={URL_LOGO}
            className={`${
              !open ? "w-100 height-10" : "w-25 height-24"
            } rounded-xl `}
            alt=""
          />
        </Link>

        <div className="flex h-full  flex-col">
          <ul className="flex h-[70%] flex-col gap-1 overflow-x-hidden whitespace-pre px-2.5  py-5 text-[0.9rem] font-medium scrollbar-thin  scrollbar-track-indigo-700 md:h-[68%]">
            <li>
              <AnimatedLink to={nameRoutes.root} className="link">
                <Icon color={iconColor} size={23} name="bi bi-graph-up-arrow" />
                Dashboard
              </AnimatedLink>
            </li>
            <li>
              <AnimatedLink to={nameRoutes.calendar} className="link">
                <Icon color={iconColor} size={23} name="bi bi-calendar-week" />
                Calendario
              </AnimatedLink>
            </li>
            {(open || isTabletMid) && (
              <div className="border-y border-slate-300 py-3 ">
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
              <AnimatedLink to={nameRoutes.settings} className="link">
                <Icon color={iconColor} size={23} name="bi bi-gear" />
                Cambiar Contraseña
              </AnimatedLink>
            </li>
            <li>
              <a
                href="#"
                className="link font-bold text-red-600"
                onClick={() => {
                  logout();
                  navigate(nameRoutes.login);
                }}
              >
                <Icon color={"red"} size={23} name="bi bi-box-arrow-left" />
                Salir
              </a>
            </li>
          </ul>
          {open && (
            <div className="z-50 my-auto max-h-48 w-full flex-1 whitespace-pre  text-sm  font-medium  ">
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
          onClick={() => {
            setOpen(!open);
            localStorage.setItem("openSidebar", open ? "false" : "true");
          }}
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
          transition={{ duration: 0.3 }}
          className="absolute bottom-12 right-2 z-50 hidden h-fit w-fit cursor-pointer md:block"
        >
          <Icon
            name="bi bi-caret-left-fill"
            size={25}
          />
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
