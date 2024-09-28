import { z } from "zod";

import { invalid_type_error, required_error } from "../../config/contants";

export const cashReportShema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  cashierName: z
    .string({ invalid_type_error, required_error })
    .min(3, {
      message: "El nombre del cajero debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre del cajero debe tener como máximo 50 caracteres",
    })
    .trim()
    .refine((data) => data.trim() !== "", {
      message: "Debes proporcionar el nombre del cajero",
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
