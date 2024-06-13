import { Link } from "react-router-dom";
import { nameRoutes } from "../../config/contants";

export const Footer = () => {
  return (
    <footer className="main-footer">
      <strong className="text-sky-800">
        <Link to={nameRoutes.root}>Copyright &copy; 2024 Tass</Link> .{" "}
      </strong>
      Todos los derechos reservados.
      <div className="d-none d-sm-inline-block float-right">
        <b>Version</b> 1.0.0
      </div>
    </footer>
  );
};
