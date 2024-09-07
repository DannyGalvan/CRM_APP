import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";

export const routeDetailsShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  routeId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar una ruta",
    }),
  orderId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar una orden",
    }),
  state: z.number().optional(),
});

export const routeDetailsShemaArray = z
  .array(routeDetailsShema, {
    invalid_type_error,
    required_error,
    description: "Error en los detalles de la ruta",
    message: "Debes agregar al menos un detalle",
  })
  .nonempty({ message: "Debes asignar al menos una orden a esta ruta! 🤷‍♂️" });
