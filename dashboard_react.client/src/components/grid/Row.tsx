import { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
  className?: string;
}

export const Row = ({ children, className }: RowProps) => {
  return <div className={`flex flex-wrap ${className}`}>{children}</div>;
};
