import { usePilots } from "../../hooks/usePilots";
import Protected from "../../routes/middlewares/Protected";
import { PilotRequest } from "../../types/PilotRequest";
import { PilotForm } from "../../components/forms/PilotForm";
import { Col } from "../../components/grid/Col";

export const initialPilot: PilotRequest = {
  name: "",
  lastName: "",
  phone: "",
  email: "",
  state: 1,
  license: "",
};

export const CreatePilotPage = () => {
  const { create } = usePilots();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
        <Col md={8}>
          <PilotForm
            initialForm={initialPilot}
            sendForm={create}
            text="Crear"
            reboot
          />
        </Col>
      </div>
    </Protected>
  );
};
