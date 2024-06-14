import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col } from "../../components/grid/Col";
import { Row } from "../../components/grid/Row";
import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

export function Component() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { logout, isLoggedIn } = useAuth();

  const [text, setText] = useState("Regresar");

  useEffect(() => {
    if (state.statusCode === "404" || state.statusCode === "403") {
      setText("Regresar");
    } else if (state.statusCode === "500" || state.statusCode === "401") {
      logout();
      navigate(nameRoutes.login);
    }
  }, [state]);

  const handleClick = () => {
    if (state.statusCode === "404") {
      isLoggedIn ? navigate(-1) : navigate(nameRoutes.login);
    } else if (state.statusCode === "403") {
      navigate(-3);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto">
      <Row className="min-h-[80vh] items-center justify-center">
        <Col xs={12} className="text-center">
          <span className="block text-8xl font-bold">
            {state?.statusCode ?? state?.name}
          </span>
          <div className="mb-4 text-3xl italic">{state?.message}</div>
          <span
            className="cursor-pointer font-bold text-sky-700 hover:text-sky-500"
            onClick={handleClick}
          >
            {text}
          </span>
        </Col>
      </Row>
    </div>
  );
}

Component.displayName = "ErrorPage";
