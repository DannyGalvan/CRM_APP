import { Col } from "../components/grid/Col";
import { URL_LOGO } from "../config/contants";

const LoadingPage = () => {
  return (
    <div className="flex h-[100vh] flex-row items-center">
      <div className="container mx-auto">
        <div className="flex flex-row justify-center">
          <Col md={4} sm={4} xs={8}>
            <img
              src={URL_LOGO}
              className={`loading w-100 rounded-xl object-cover`}
              alt="logo"
            />
            <h3 className="text-center text-3xl font-bold text-gray-500">
              Cargando... Espere
            </h3>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
