import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";

export const customerShema = z.object({
  firstName: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El primer nombre debe tener minimo 3 caracteres" })
    .max(50, {
      message: "El primer nombre no puede tener más de 50 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El primer nombre no puede estar vacío",
    }),
  secondName: z.string({ invalid_type_error, required_error }).optional(),
  firstLastName: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El primer apellido debe tener minimo 3 caracteres" })
    .max(50, {
      message: "El primer apellido no puede tener más de 50 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El primer apellido no puede estar vacío",
    }),
  secondLastName: z.string({ invalid_type_error, required_error }).optional(),
  firstPhone: z
    .string({ invalid_type_error, required_error })
    .min(8, { message: "El primer telefono debe tener minimo 8 caracteres" })
    .max(10, {
      message: "El primer telefono no puede tener más de 10 caracteres",
    })
    .regex(/^[0-9]*$/, {
      message: "El primer telefono solo puede contener números",
    })
    .refine((data) => data.trim() !== "", {
      message: "El primer telefono no puede estar vacío",
    }),
  secondPhone: z
    .string({ invalid_type_error, required_error })
    .regex(/^[0-9]*$/, {
      message: "El segundo telefono solo puede contener números",
    })
    .optional(),
  address: z
    .string({ invalid_type_error, required_error })
    .min(5, { message: "La dirección debe tener minimo 5 caracteres" })
    .max(250, {
      message: "La dirección no puede tener más de 100 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La dirección no puede estar vacía",
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
  colony_Condominium: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "La colonia o condominio no puede estar vacío",
    }),
  socialNetwork: z.string({ invalid_type_error, required_error }).optional(),
});
