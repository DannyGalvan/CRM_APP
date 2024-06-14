import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col } from "../../components/grid/Col";
import { Row } from "../../components/grid/Row";
import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

interface NotFoundProps {
  Message: string;
  Number: string;
}

export const NotFound = ({ Message, Number }: NotFoundProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [text, setText] = useState("Regresar");

  useEffect(() => {
    if (Number === "404" || Number === "403") {
      setText("Regresar");
    } else if (Number === "500" || Number === "401") {
      logout();
      navigate(nameRoutes.login);
    }
  }, [Number]);

  const handleClick = () => {
    if (Number === "404") {
      isLoggedIn ? navigate(-1) : navigate(nameRoutes.login);
    } else if (Number === "403") {
      navigate(-3);
    } 
  };

  return (
    <div className="container mx-auto my-auto">
      <Row className="min-h-[80vh] items-center justify-center">
        <Col xs={12} className="text-center">
          <span className="block text-8xl font-bold">{Number}</span>
          <div className="mb-4 text-3xl italic">{Message}</div>
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
};
