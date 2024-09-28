import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const collectionSchema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
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
  nameView: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El nombre de vista debe tener minimo 3 caracteres" })
    .max(50, {
      message: "El nombre de vista no puede tener más de 50 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El nombre de vista no puede estar vacío",
    }),
  isReadOnly: z.boolean({ invalid_type_error, required_error }),
  isVisible: z.boolean({ invalid_type_error, required_error }),
});
