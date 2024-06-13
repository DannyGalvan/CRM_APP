import { Button, Input } from "@nextui-org/react";
import { Icon } from "../../components/Icons/Icon";
import { Col } from "../../components/grid/Col";
import { Response } from "../../components/messages/Response";
import { useAuth } from "../../hooks/useAuth";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { useToggle } from "../../hooks/useToggle";
import ProtectedPublic from "../../routes/middlewares/ProtectedPublic";
import { changePassword } from "../../services/authService";

export interface ChangePasswordForm {
  idUser: string;
  password: string;
  confirmPassword: string;
}

const initialForm: ChangePasswordForm = {
  idUser: "0",
  password: "",
  confirmPassword: "",
};

const validateForm = (form: ChangePasswordForm) => {
  const errors: ErrorObject = {};

  if (!form.password.trim()) {
    errors.password = "La contraseña es requerida";
  }
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = "La confirmación de contraseña es requerida";
  }
  if (form.password.trim() !== form.confirmPassword.trim()) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
};

export function Component() {
  const { userId, logout } = useAuth();
  const {open:password, toggle:togglePassword} = useToggle();
  const {open:confirm, toggle:toggleConfirm} = useToggle();

  const sendForm = async (form: ChangePasswordForm) => {
    form.idUser = userId;
    const response = await changePassword(form);
    if (response.success) {
      logout();
    }
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
  } = useForm(initialForm, validateForm, sendForm);

  return (
    <ProtectedPublic>
      <div className="page-view container flex flex-col flex-wrap items-center justify-center">
        <Col xl={6} lg={8} md={10} sm={12}>
          {success != null && <Response message={message} type={success} />}
          <h1 className="text-center text-4xl font-bold">Cambiar contraseña</h1>
        </Col>
        <form
          onSubmit={handleSubmit}
          className="col-xl-6 col-lg-8 col-md-10 col-12 flex flex-row flex-wrap  justify-center"
        >
          <Col md={12}>
            <Input
              label="Contraseña"
              name="password"
              errorMessage={errors?.password}
              type={password ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors?.password}
              isRequired={true}
              className={"py-4"}
              size="lg"
              variant="bordered"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePassword}
                >
                  {password ? (
                    <Icon name="bi bi-eye-slash-fill text-2xl text-dark pointer-events-none" />
                  ) : (
                    <Icon name="bi bi-eye-fill text-2xl text-dark pointer-events-none" />
                  )}
                </button>
              }
            />
          </Col>
          <Col md={12}>
            <Input
              label="Confirmacion de contraseña"
              name="confirmPassword"
              errorMessage={errors?.confirmPassword}
              type={confirm ? "text" : "password"}
              value={form.confirmPassword}
              isInvalid={!!errors?.confirmPassword}
              onChange={handleChange}
              isRequired={true}
              className={"py-4"}
              size="lg"
              variant="bordered"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirm}
                >
                  {confirm ? (
                    <Icon name="bi bi-eye-slash-fill text-2xl text-dark pointer-events-none" />
                  ) : (
                    <Icon name="bi bi-eye-fill text-2xl text-dark pointer-events-none" />
                  )}
                </button>
              }
            />
          </Col>
          <Col md={12} className={"mt-5"}>
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
              Cambiar contraseña
            </Button>
          </Col>
        </form>
      </div>
    </ProtectedPublic>
  );
}

Component.displayName = "ChangePasswordPage";
