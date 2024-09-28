import { HTMLAttributes } from "react";

interface IconProps {
  name: HTMLAttributes<HTMLElement>["className"];
  size?: number;
  color?: string;
}

export const Icon = ({ name, size, color }: IconProps) => {
  const iconSize = size ? `${size}px` : "25px";

  return <i className={name} style={{ fontSize: iconSize, color: color }} />;
};
