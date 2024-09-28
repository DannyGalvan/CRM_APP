import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const customerAddressShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  customerId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar un cliente",
    }),
  departmentId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar un departamento",
    }),
  municipalityId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar un municipio",
    }),
  zoneId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar una zona",
    }),
  colonyCondominium: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "La colonia o condominio no puede estar vacío",
    }),
  address: z
    .string({ invalid_type_error, required_error })
    .min(5, { message: "La dirección debe tener minimo 5 caracteres" })
    .max(250, {
      message: "La dirección no puede tener más de 100 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La dirección no puede estar vacía",
    }),
  state: z.number({ invalid_type_error, required_error }).optional(),
});
