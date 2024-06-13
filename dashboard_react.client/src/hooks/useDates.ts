import { useState } from 'react';

export const useDates = () => {
  const [date, setDate] = useState({
    start: "",
    end: "",
  });

  const handleDate = (start: string, end: string) => {
    // Paso 1: Convierte la cadena de fecha a un objeto Date
    const date = new Date(end);

    // Paso 2: Resta un día
    date.setDate(date.getDate());

    // Paso 3: Convierte el objeto Date de vuelta a una cadena en el formato "YYYY-MM-DD"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados, así que sumamos 1
    const day = String(date.getDate()).padStart(2, '0');

    const newDateString = `${year}-${month}-${day}`;

    setDate({ start, end: newDateString });
  };

  return { date, handleDate };
}
