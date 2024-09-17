import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Icon } from "../../components/Icons/Icon";
import { Response } from "../../components/messages/Response";
import { useAuth } from "../../hooks/useAuth";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { useToggle } from "../../hooks/useToggle";
import ProtectedLogin from "../../routes/middlewares/ProtectedLogin";
import { login } from "../../services/authService";
import { AuthResponse } from "../../types/ApiResponse";

export interface LoginForm {
  userName: string;
  password: string;
}

const initialForm = {
  userName: "",
  password: "",
};

const validateForm = (form: LoginForm) => {
  const errors: ErrorObject = {};

  if (!form.userName.trim()) {
    errors.userName = "El campo email es requerido";
  }

  if (!form.password.trim()) {
    errors.password = "El campo password es requerido";
  } else if (form.password.length < 5) {
    errors.password = "El password debe tener al menos 6 caracteres";
  }

  return errors;
};

export function Component() {
  const { signIn, singnInReports } = useAuth();
  const { open, toggle } = useToggle();

  const petition = async (form: LoginForm) => {
    await singnInReports(form);

    const response = await login(form);

    if (!response.success) {
      return response;
    }

    const data = response.data as AuthResponse;

    signIn({
      email: data.email,
      token: data.token,
      userName: data.userName,
      name: data.name,
      operations: data.operations,
      redirect: false,
      isLoggedIn: true,
      userId: data.userId,
    });

    return response;
  };

  const {
    form,
    errors,
    handleChange,
    handleSubmit,
    success,
    loading,
    message,
  } = useForm<LoginForm, AuthResponse>(initialForm, validateForm, petition);

  return (
    <ProtectedLogin>
      <section className="flex h-screen w-screen flex-col items-center justify-center md:flex-row">
        <div className="flex w-full items-center px-6 md:mx-auto md:max-w-md lg:max-w-lg xl:max-w-xl">
          <Card className="w-full shadow-[0px_20px_20px_10px_#A0AEC0]">
            <CardBody className="p-10">
              {success != null && <Response message={message} type={success} />}
              <h1 className="mb-10 text-center text-3xl font-bold leading-tight">
                Bienvenid@ Inicia Sesión
              </h1>
              <form onSubmit={handleSubmit}>
                <Input
                  name={"userName"}
                  id={"email"}
                  label={"Nombre de usuario"}
                  onChange={handleChange}
                  type={"text"}
                  value={form.userName}
                  isInvalid={!!errors?.userName}
                  errorMessage={errors?.userName}
                  isRequired={true}
                  className={"py-4"}
                  size="lg"
                  variant="bordered"
                />
                <Input
                  name={"password"}
                  id={"password"}
                  label={"Contraseña"}
                  onChange={handleChange}
                  type={open ? "text" : "password"}
                  value={form.password}
                  isInvalid={!!errors?.password}
                  errorMessage={errors?.password}
                  isRequired={true}
                  className={"py-4"}
                  size="lg"
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggle}
                    >
                      {open ? (
                        <Icon name="bi bi-eye-slash-fill text-2xl text-dark pointer-events-none" />
                      ) : (
                        <Icon name="bi bi-eye-fill text-2xl text-dark pointer-events-none" />
                      )}
                    </button>
                  }
                />
                <Button
                  isLoading={loading}
                  type="submit"
                  radius="md"
                  size="lg"
                  color="primary"
                  fullWidth
                  variant="shadow"
                  className="mt-4 py-4 font-bold"
                >
                  Iniciar Sesión
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>
    </ProtectedLogin>
  );
}

Component.displayName = "LoginPage";
