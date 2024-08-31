import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";

export const pilotSchema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  name: z
    .string({ invalid_type_error, required_error })
    .trim()
    .min(3, { message: "El nombre debe tener mas de 3 caracteres" })
    .max(50, { message: "El nombre no puede tener mas de 50 caracteres" })
    .refine((data) => data !== "", {
      message: "El nombre no puede estar vacio",
    }),
  lastName: z
    .string({ invalid_type_error, required_error })
    .trim()
    .min(3, { message: "El apellido debe tener mas de 3 caracteres" })
    .max(50, { message: "El apellido no puede tener mas de 50 caracteres" })
    .refine((data) => data !== "", {
      message: "El apellido no puede estar vacio",
    }),
  license: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const licenseString = z.string().min(3).max(50);

          return licenseString.safeParse(data).success;
        }
      },
      {
        message: "La licencia debe tener entre 3 y 50 caracteres",
      },
    ),
  phone: z
    .string({ invalid_type_error, required_error })
    .trim()
    .min(8, { message: "El telefono debe tener mas de 8 caracteres" })
    .max(12, { message: "El telefono no puede tener mas de 12 caracteres" })
    .refine((data) => data !== "", {
      message: "El telefono no puede estar vacio",
    }),
  email: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const emailString = z.string().email();

          return emailString.safeParse(data).success;
        }
      },
      {
        message: "El correo no es valido",
      },
    ),
});
