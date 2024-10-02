import { CashReportForm } from "../../components/forms/CashReportForm";
import { Col } from "../../components/grid/Col";
import { useCashReport } from "../../hooks/useCashReport";
import Protected from "../../routes/middlewares/Protected";
import { CashReportRequest } from "../../types/CashReportRequest";

export const initialCashReport: CashReportRequest = {
  observations: "",
  cashierName: "",
  state: 1,
  orders: [],
};

export const CreateCashReportPage = () => {
  const { create } = useCashReport();

  return (
    <Protected>
      <div className="flex flex-col flex-wrap justify-center items-center page-view">
        <Col md={12}>
          <CashReportForm
            reboot
            initialForm={initialCashReport}
            sendForm={create}
            text="Crear"
          />
        </Col>
      </div>
    </Protected>
  );
};
