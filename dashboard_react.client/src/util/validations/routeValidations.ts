import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const routeShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  pilotId: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes seleccionar un piloto",
    }),
  observations: z
    .string({ invalid_type_error, required_error })
    .trim()
    .refine(
      (data) => {
        if (data == "") {
          return true;
        } else {
          const licenseString = z.string().min(10).max(250);

          return licenseString.safeParse(data).success;
        }
      },
      {
        message: "Las observaciones debe tener entre 10 y 250 caracteres",
      },
    ),
  state: z.number().optional(),
});
