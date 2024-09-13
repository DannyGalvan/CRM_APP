import { useQuery } from "@tanstack/react-query";
import { useCashReport } from "../../hooks/useCashReport";
import { useDrawer } from "../../hooks/useDrawer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useCashReportStore } from "../../store/useCashReportStore";
import { ApiResponse } from "../../types/ApiResponse";
import { CashReportResponse } from "../../types/CashReportResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { ApiError } from "../../util/errors";
import { getCashReports } from "../../services/cashReportService";
import { useEffect } from "react";
import { NotFound } from "../error/NotFound";
import Protected from "../../routes/middlewares/Protected";
import { Col } from "../../components/grid/Col";
import { Button } from "@nextui-org/button";
import { Icon } from "../../components/Icons/Icon";
import { compactGrid } from "../../theme/tableTheme";
import { TableRoot } from "../../components/table/TableRoot";
import { CashReportResponseColumns } from "../../components/columns/CashReportResponseColumns";
import { Drawer } from "../../containers/Drawer";
import { CashReportForm } from "../../components/forms/CashReportForm";
import { initialCashReport } from "./CreateCashReportPage";

export const CashReportPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useCashReport();
  const { cashReport, addCashReport } = useCashReportStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<CashReportResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: ["cashReports"],
    queryFn: () => getCashReports("State:eq:1"),
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }
  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Corte de Caja
          </Button>
        </Col>
        <TableRoot
          columns={CashReportResponseColumns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de las rutas"
          styles={compactGrid}
          title={"Cortes de Caja"}
          width={false}
        />
         {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Corte de Caja`}
            size="2xl"
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
          >
            <div className="p-5">
              <CashReportForm initialForm={cashReport!} sendForm={update} text="Editar" />
            </div>
          </Drawer>
        )}
      </div>
    </Protected>
  );
};
