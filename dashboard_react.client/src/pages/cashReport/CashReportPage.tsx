import { useCashReport } from "../../hooks/useCashReport";
import { useDrawer } from "../../hooks/useDrawer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { CashReportResponse } from "../../types/CashReportResponse";
import { getCashReports } from "../../services/cashReportService";
import { useEffect } from "react";
import Protected from "../../routes/middlewares/Protected";
import { Col } from "../../components/grid/Col";
import { Button } from "@nextui-org/button";
import { Icon } from "../../components/Icons/Icon";
import { compactGrid } from "../../theme/tableTheme";
import { CashReportResponseColumns } from "../../components/columns/CashReportResponseColumns";
import { Drawer } from "../../containers/Drawer";
import { CashReportForm } from "../../components/forms/CashReportForm";
import { initialCashReport } from "./CreateCashReportPage";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";
import { useCashReportStore } from "../../store/useCashReportStore";

export const CashReportPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useCashReport();
  const { cashReport, addCashReport, cashFilters, setCashFilters } =
    useCashReportStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Corte de Caja
          </Button>
        </Col>
        <TableServer<CashReportResponse>
          columns={CashReportResponseColumns}
          hasFilters={true}
          text="de los cortes de caja"
          styles={compactGrid}
          title={"Cortes de Caja"}
          width={false}
          filters={cashFilters}
          setFilters={setCashFilters}
          queryFn={getCashReports}
          queryKey={QueryKeys.CashReports}
          fieldRangeOfDates="CreatedAt"
          hasRangeOfDates
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Corte de Caja`}
            size="2xl"
            id="create"
          >
            <div className="p-5">
              <CashReportForm
                initialForm={initialCashReport}
                sendForm={create}
                text="Crear"
                reboot
              />
            </div>
          </Drawer>
        )}
        {render && (
          <Drawer
            isOpen={openUpdate}
            setIsOpen={() => {
              setOpenUpdate();
              addCashReport(null);
            }}
            title={`Editar Corte de Caja`}
            size="2xl"
            id="update"
          >
            <div className="p-5">
              <CashReportForm
                initialForm={cashReport!}
                sendForm={update}
                text="Editar"
              />
            </div>
          </Drawer>
        )}
      </div>
    </Protected>
  );
};
