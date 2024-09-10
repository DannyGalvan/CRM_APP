import { z } from "zod";
import { invalid_type_error, required_error } from "../../config/contants";
import { getLocalTimeZone, today } from "@internationalized/date";

export const orderSchema = z.object({
  id: z.string({ invalid_type_error, required_error }).optional(),
  deliveryDate: z
    .date({ invalid_type_error, required_error })
    .min(today(getLocalTimeZone()).toDate(getLocalTimeZone()), {
      message: `La fecha de la orden no puede ser menor a ${today(getLocalTimeZone()).toString()}`,
    }),
  customerId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "El cliente no puede estar vacio",
    }),
  customerDirectionId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "La direccion del cliente no puede estar vacia",
    }),
  paymentTypeId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "El metodo de pago no puede estar vacio",
    }),
  orderStateId: z
    .string({ invalid_type_error, required_error })
    .refine((data) => data.trim() !== "", {
      message: "El estado de la orden no puede estar vacio",
    }),
  orderDetails: z.array(
    z
      .object({
        numberLine: z.number({ invalid_type_error, required_error }).positive({
          message: "El numero de linea debe ser positivo",
        }),
        productId: z
          .string({ invalid_type_error, required_error })
          .refine((data) => data.trim() !== "", {
            message: "El producto no puede estar vacio",
          }),
        productName: z
          .string({ invalid_type_error, required_error })
          .refine((data) => data.trim() !== "", {
            message: "El nombre del producto no puede estar vacio",
          }),
        quantity: z
          .number({ invalid_type_error, required_error })
          .positive({ message: "La cantidad debe ser positiva" })
          .min(1, { message: "La cantidad debe ser mayor a 0" }),
        unitPrice: z
          .number({ invalid_type_error, required_error })
          .positive({
            message: "El precio unitario debe ser positivo",
          })
          .min(0, { message: "El precio unitario debe ser mayor a 0" }),
      })
      .optional(),
  ),
});
