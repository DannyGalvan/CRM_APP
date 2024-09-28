import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const cashReportDetailsShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  cashReportId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar una cortes de caja",
    }),
  orderId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar una orden",
    }),
  state: z.number().optional(),
});

export const cashReportDetailsShemaArray = z
  .array(cashReportDetailsShema, {
    invalid_type_error,
    required_error,
    description: "Error en los detalles de la ruta",
    message: "Debes agregar al menos un detalle",
  })
  .nonempty({ message: "Debes asignar al menos una orden a este corte! 🤷‍♂️" });

export const cashReportDetailsWithOutIdCashReportShema =
  cashReportDetailsShema.omit({
    cashReportId: true,
  });

export const cashReportDetailsWithOutCashReportShemaArray = z
  .array(cashReportDetailsWithOutIdCashReportShema, {
    invalid_type_error,
    required_error,
    description: "Error en los detalles de la ruta",
    message: "Debes agregar al menos un detalle",
  })
  .nonempty({ message: "Debes asignar al menos una orden a este corte! 🤷‍♂️" });
