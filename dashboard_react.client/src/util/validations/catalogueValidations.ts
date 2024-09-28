import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const catalogueShema = z.object({
  name: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El nombre debe tener minimo 3 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    }),
  description: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "La descripción debe tener minimo 3 caracteres" })
    .max(200, {
      message: "La descripción no puede tener más de 200 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La descripción no puede estar vacía",
    }),
  state: z.number({ invalid_type_error, required_error }),
});
