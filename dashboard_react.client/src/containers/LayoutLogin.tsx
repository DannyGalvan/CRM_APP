import { ReactNode } from "react";

interface LayoutLoginProps {
  children: ReactNode;
}

export const LayoutLogin = ({ children }: LayoutLoginProps) => {
  return <main className="h-[100vh] flex justify-center">{children}</main>;
};
