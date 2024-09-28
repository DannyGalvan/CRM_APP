import { ReactNode } from "react";

interface LayoutLoginProps {
  children: ReactNode;
}

export const LayoutLogin = ({ children }: LayoutLoginProps) => {
  return <main className="flex h-[100vh] justify-center">{children}</main>;
};
