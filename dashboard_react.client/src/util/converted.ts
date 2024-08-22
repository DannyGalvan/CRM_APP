import { EventInput } from "@fullcalendar/core/index.js";
import { Selector } from "react-data-table-component";
import { toast } from "react-toastify";
import { ZodError } from "zod";
import { ErrorObject } from "../hooks/useForm";
import { Authorizations } from "../types/Authorizations";
import { Operations } from "../types/Operations";

export const toCamelCase = (inputString: string) => {
  return inputString.replace(
    /(\w)(\w*)/g,
    function (_match, firstChar, restOfString) {
      return firstChar.toLowerCase() + restOfString;
    },
  );
};

export const dataFormatter = (number: number) =>
  `Q${Intl.NumberFormat("en").format(number).toString()}`;

export const toAllOperations = (operations: Authorizations[]) => {
  const allOperations: Operations[] = [];

  operations.forEach((op) => {
    allOperations.push(...op.operations);
  });

  return allOperations;
};

export const toFormatTime = (date: string) => {
  // Crear un objeto Date con la fecha
  const tempDate: Date = new Date(date);

  // Obtener la hora, minutos y segundos
  const hours: number = tempDate.getHours();
  const minutes: number = tempDate.getMinutes();

  // Formatear la hora si es necesario (por ejemplo, agregar ceros delante si es menor que 10)
  const formatHour: string = hours < 10 ? "0" + hours : hours.toString();
  const formatMinute: string =
    minutes < 10 ? "0" + minutes : minutes.toString();

  // Crear una cadena de texto con la hora
  const formatHours: string = `${formatHour}:${formatMinute}`;

  // Mostrar la hora
  return formatHours;
};

export const toFormatDate = (date: string) => {
  const dateTemp = date.length === 10 ? date + "T06:00:00" : date;

  // Crear un objeto Date con la fecha
  const fecha: Date = new Date(dateTemp);

  // Obtener el día, mes y año
  const dia: number = fecha.getDate();
  const mes: number = fecha.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se agrega 1
  const año: number = fecha.getFullYear();

  // Formatear la fecha si es necesario (por ejemplo, agregar ceros delante si es menor que 10)
  const diaFormateado: string = dia < 10 ? "0" + dia : dia.toString();
  const mesFormateado: string = mes < 10 ? "0" + mes : mes.toString();

  // Crear una cadena de texto con la fecha
  const fechaFormateada: string = `${año}-${mesFormateado}-${diaFormateado}`;

  // Mostrar la fecha
  return fechaFormateada;
};

export const toEventInput = (event?: EventInput) => {
  if (!event) {
    return null;
  }

  const newEvent: EventInput = {
    title: event.title,
    description: event?.extendedProps?.description,
    start: toFormatDate(event.start as string),
    end: toFormatDate((event.end as string) ?? (event.start as string)),
    allDay: event.allDay,
    time: toFormatTime(event.start as string),
    id: event.id,
  };

  console.log("EventDate", event);

  return newEvent;
};

export const dateNow = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos entre UTC y la zona horaria local
  now.setMinutes(now.getMinutes() - offset); // Ajusta la fecha restando la diferencia

  const formattedDate = now.toISOString().split("T")[0];
  return formattedDate;
};

export const today = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos entre UTC y la zona horaria local
  now.setMinutes(now.getMinutes() - offset); // Ajusta la fecha restando la diferencia

  return now;
};

export const minDateMaxDate = () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const minDate = sixMonthsAgo.toISOString().substring(0, 10);
  const maxDate = new Date().toISOString().substring(0, 10);

  return { minDate, maxDate };
};

export const handleOneLevelZodError = ({ issues }: ZodError<unknown>) => {
  const formData: ErrorObject = {};

  issues.forEach(({ path, message }) => {
    formData[path.join("-")] = message;
  });

  return formData;
};

export const hasJsonOrOtherToString = (object: any, func: Selector<any>) => {
  return typeof func(object) === "object"
    ? JSON.stringify({ ...object }).toLowerCase()
    : func(object)?.toString().toLowerCase();
};

export const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Texto copiado al portapapeles");
  } catch (err) {
    console.error("Error al copiar el texto: ", err);
  }
};
