import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";

export const customerShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  firstName: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El primer nombre debe tener minimo 3 caracteres" })
    .max(50, {
      message: "El primer nombre no puede tener más de 50 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El primer nombre no puede estar vacío",
    }),
  secondName: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const secondNameString = z.string().min(3).max(50);

          return secondNameString.safeParse(data).success;
        }
      },
      {
        message: "El segundo nombre debe tener entre 3 y 50 caracteres",
      },
    ),
  firstLastName: z
    .string({ invalid_type_error, required_error })
    .min(3, { message: "El primer apellido debe tener minimo 3 caracteres" })
    .max(50, {
      message: "El primer apellido no puede tener más de 50 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El primer apellido no puede estar vacío",
    }),
  secondLastName: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const secondLastNameString = z.string().min(3).max(50);

          return secondLastNameString.safeParse(data).success;
        }
      },
      {
        message: "El segundo nombre debe tener entre 3 y 50 caracteres",
      },
    ),
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
  secondPhone: z.string({ invalid_type_error, required_error }).refine(
    (data) => {
      if (data == "") {
        return true;
      } else {
        const secondPhoneString = z.string().regex(/^[0-9]*$/);

        return secondPhoneString.safeParse(data).success;
      }
    },
    {
      message: "El segundo telefono solo puede contener números",
    },
  ),
  socialNetworks: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const socialNetworkString = z.string().min(10).max(500);

          return socialNetworkString.safeParse(data).success;
        }
      },
      {
        message: "Las redes sociales debe tener entre 10 y 500 caracteres",
      },
    ),
});
