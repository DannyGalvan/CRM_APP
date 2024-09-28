import { FormEvent, ReactNode } from "react";

interface ContainerSearchProps {
  isForm: boolean;
  children: ReactNode;
  submitFn?: (e: FormEvent) => void;
  className?: string;
}

export const ContainerSearch = ({
  isForm,
  submitFn,
  children,
  className,
}: ContainerSearchProps) => {
  return !isForm ? (
    <article className={className}>{children}</article>
  ) : (
    <form className={className} onSubmit={submitFn}>
      {children}
    </form>
  );
};
