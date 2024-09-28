import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const eventSchema = z.object({
  allDay: z.boolean({ invalid_type_error, required_error }),
  title: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El titulo debe tener minimo 3 caracteres" })
    .max(50, { message: "El título no puede tener más de 50 caracteres" })
    .refine((data) => data.trim() !== "", {
      message: "El título no puede estar vacío",
    }),
  start: z.string({ invalid_type_error, required_error }),
  end: z.string({ invalid_type_error, required_error }),
  description: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "La descripción debe tener minimo 3 caracteres" })
    .max(200, {
      message: "La descripción no puede tener más de 200 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La descripción no puede estar vacía",
    }),
  time: z
    .string({ invalid_type_error, required_error })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "La hora no es válida",
    })
    .optional(),
});
