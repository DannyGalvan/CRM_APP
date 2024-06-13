import { useState } from "react";
import { ApiResponse } from "../types/ApiResponse";
import { ValidationFailure } from "../types/ValidationFailure";
import { toCamelCase } from "../util/converted";
import { ErrorObject } from "./useForm";

export const useResponse = <T, U>() => {
  const [t, setT] = useState<T>();
  const [u, setU] = useState<ErrorObject>();
  const [m, setM] = useState<string>("");
  const [s, setS] = useState<boolean | null>(null);

  const showErrors = (errors: ValidationFailure[]) => {
    let errorsConverted: ErrorObject = {};

    errors.forEach((error) => {
      errorsConverted[toCamelCase(error.propertyName)] = error.errorMessage;
    });

    Object.keys(errorsConverted).length !== 0 && setU(errorsConverted);
  };

  const setErrors = (errors: ErrorObject) => {
    setU(errors);
  };

  const set = ({ data, success, message }: ApiResponse<T | U>) => {
    if (success) {
      setT(data as T);
    } else {
      showErrors((data as ValidationFailure[]) ?? []);
    }
    setS(success);
    setM(message!);
  };

  return { t, u, s, set, setU: setErrors, m };
};
