import { IoIosClose } from 'react-icons/io';

interface DrawerProps {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: React.ReactNode | string;
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Drawer = ({ children, isOpen, setIsOpen, title, size = "md" } : DrawerProps) => {
  return (
    <div
      className={
        'fixed overflow-hidden z-[100] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
        (isOpen
          ? ' transition-opacity opacity-100 duration-500 translate-x-0  '
          : ' transition-all delay-500 opacity-0 translate-x-full  ')
      }
    >
      <section
        className={
          `w-screen mw-${size} z-[0] right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform ` +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className={`relative my-6 flex h-full mw-${size} flex-col overflow-y-scroll px-0 pb-10 scrollbar-thin`}>
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
