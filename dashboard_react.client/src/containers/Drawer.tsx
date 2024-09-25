import { IoIosClose } from "react-icons/io";

interface DrawerProps {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: React.ReactNode | string;
  id?: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export const Drawer = ({
  children,
  isOpen,
  setIsOpen,
  title,
  size = "md",
  id,
}: DrawerProps) => {
  return (
    <div
      className={
        "fixed inset-0 z-[100] transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out " +
        (isOpen
          ? " translate-x-0 opacity-100 transition-opacity duration-500  "
          : " translate-x-full opacity-0 transition-all delay-500  ")
      }
    >
      <section
        className={
          `w-screen mw-${size} delay-400 absolute right-0 z-[0] h-full transform bg-white shadow-xl transition-all duration-500 ease-in-out ` +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article
          id={id}
          className={`relative my-6 flex h-full mw-${size} flex-col overflow-y-scroll px-0 pb-10 scrollbar-thin`}
        >
          <header className="p-4 text-lg font-bold">{title}</header>
          <IoIosClose
            className="absolute right-4 top-3 cursor-pointer text-red-600"
            size={35}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          {children}
        </article>
      </section>
      <section
        className="h-full w-screen cursor-pointer"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </div>
  );
};
