interface MesajeNoDataProps {
  mesaje: string;
}

export const MesajeNoData = ({ mesaje }: MesajeNoDataProps) => {
  return (
    <div className="m-3">
      <p className="text-center font-bold text-red-700">{mesaje}</p>
    </div>
  );
};
