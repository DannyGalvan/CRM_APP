import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  className?: string;
}

export const Grid = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  gap,
  className,
}: GridProps) => {
  const colClasses = [
    "grid",
    xs ? `gcol-${xs}` : "",
    sm ? `gcol-sm-${sm}` : "",
    md ? `gcol-md-${md}` : "",
    lg ? `gcol-lg-${lg}` : "",
    xl ? `gcol-xl-${xl}` : "",
    `gap-${gap ?? 4}`,
    "px-2",
    className,
  ];
  return <div className={colClasses.join(" ")}>{children}</div>;
};
