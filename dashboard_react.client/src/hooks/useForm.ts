import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../types/ApiResponse';
import { ValidationFailure } from '../types/ValidationFailure';
import { ApiError } from '../util/errors';
import { useResponse } from './useResponse';

export interface ErrorObject {
  [key: string]: string | undefined;
}

export const useForm = <T,U>(
  initialForm : T,
  validateForm : (form : T) => ErrorObject,
  peticion : (form : T) => Promise<ApiResponse<U | ValidationFailure[]>>,
  reboot? : boolean
) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<T>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const {s,set,t,u,m, setU} = useResponse<U,ValidationFailure[]>();

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newForm = {
      ...form,
      [name]: value,
    };

    setForm(newForm);
    setU(validateForm(newForm));
  };

  const handleChangeFile = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    const newForm = {
      ...form,
      [name]: files![0],
    };

    setForm(newForm);

    setU(validateForm(newForm));
  };

  const handleBlur = (e : ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  const handleSubmit = async (e : ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    set({
      success: null,
      data: null,
      message: null,
    });

    const valErr = validateForm(form);
    console.log(valErr);
    setU(valErr);
    setLoading(true);

    if (Object.keys(valErr).length === 0) {
      try {
        const response = await peticion(form);

        if (response.success) {
          reboot && setForm(initialForm);
          e.target.reset();
        } else {
          set(response);
        }

        set(response);
      } catch (error : any) {

        error instanceof ApiError   
          ? navigate('/Error', {
            state: {
              statusCode: error.statusCode,
              message: error.message,
              name: error.name,
            },
          })
          : set({
            success: false,
            data: null,
            message: `${error?.name} ${error?.stack}`,
          });

      }
    } else {
      set({
        success: false,
        data: null,
        message: "Error en la validación del formulario",
      });
    }
    setLoading(false);
  };

  return {
    form,
    loading,
    handleBlur,
    handleChange,
    handleChangeFile,
    handleSubmit,
    success : s,
    response: t,
    errors: u,
    message: m,
  };
};
