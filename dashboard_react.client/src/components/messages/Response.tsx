interface ResponseProps {
  message: string;
  type: boolean;
  complement?: string;
}

export const Response = ({ message, type, complement }: ResponseProps) => {
  return (
    <div
      className={`my-1 flex w-full flex-row rounded-md ${
        type ? "bg-emerald-500" : "bg-rose-500"
      } p-2 shadow-lg`}
    >
      <div className="ml-1">
        <p className="font-bold text-white">
          {message} {complement}
        </p>
      </div>
    </div>
  );
};
