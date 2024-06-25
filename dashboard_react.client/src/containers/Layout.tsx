import { ReactNode } from "react";
import { Footer } from "../components/layout/Footer";
import { ModalCreateItem } from "../components/modals/ModalCreateItem";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <div
        className="h-screen flex-1 overflow-auto px-4 py-0 pt-5 scrollbar-track-sky-400  scrollbar-thumb-indigo-50 md:static"
        id="scroll"
      >
        <main className="mt-11 min-h-[90%] md:mt-0 md:min-h-[95%]">
          {children}
        </main>
        <Footer />
        <ModalCreateItem />
      </div>
    </div>
  );
};
