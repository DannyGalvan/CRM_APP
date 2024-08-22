import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";

export const productSchema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  name: z
    .string({ invalid_type_error, required_error })
    .trim()
    .min(5, { message: "El nombre debe tener mas de 3 caracteres" })
    .max(150, { message: "El nombre no puede tener mas de 150 caracteres" })
    .refine((data) => data !== "", {
      message: "El nombre no puede estar vacio",
    }),
  description: z
    .string({ invalid_type_error, required_error })
    .trim()
    .min(5, { message: "La descripcion debe tener mas de 3 caracteres" })
    .max(300, {
      message: "La descripcion no puede tener mas de 300 caracteres",
    })
    .refine((data) => data !== "", {
      message: "La descripcion no puede estar vacia",
    }),
  familyId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data !== "", {
      message: "La familia no puede estar vacia",
    }),
  cost: z
    .number({ invalid_type_error: "El costo es requerido", required_error })
    .positive({ message: "El costo debe ser positivo" })
    .min(0, { message: "El costo debe ser mayor a 0" }),
  salePrice: z
    .number({
      invalid_type_error: "El precio venta es requerido",
      required_error,
    })
    .positive({ message: "El precio debe ser positivo" })
    .min(0, { message: "El precio debe ser mayor a 0" }),
  stock: z
    .number({ invalid_type_error: "El stock es requerido", required_error })
    .min(0, { message: "El stock debe ser mayor o igual a 0" }),
});
