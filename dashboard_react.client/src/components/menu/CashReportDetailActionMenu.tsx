import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { OrderStates, QueryKeys } from "../../config/contants";
import { updateCashReportDetail } from "../../services/cashReportDetailService";
import { updateCashReport } from "../../services/cashReportService";
import { partialUpdateOrder } from "../../services/orderService";
import { useCashReportStore } from "../../store/useCashReportStore";
import { useErrorsStore } from "../../store/useErrorsStore";
import { CashReportDetailsResponse } from "../../types/CashReportDetailResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";

interface CashReportDetailActionMenuProps {
  data: CashReportDetailsResponse;
}

export const CashReportDetailActionMenu = ({
  data,
}: CashReportDetailActionMenuProps) => {
  const { getDetailsByCashReportId, cashReport, savedOrders } =
    useCashReportStore();
  const { setError } = useErrorsStore();
  const client = useQueryClient();

  const handleDelete = async () => {
    const details = savedOrders
      .filter((order) => order.id !== data.id)
      .map((order) => order.order);

    const updateResponse = await updateCashReport({
      ...cashReport,
      orders: details,
    });

    if (!updateResponse.success) {
      toast.error(updateResponse.message);
      return;
    }

    const response = await updateCashReportDetail({
      orderId: data.orderId,
      cashReportId: data.cashReportId,
      id: data.id,
      state: 0,
    });

    if (!response.success) {
      toast.warning(response.message);

      const errors = response.data as ValidationFailure[];

      errors.forEach((error) => {
        toast.error(error.propertyName + " " + error.errorMessage);
      });

      return;
    }

    toast.success("Detalle de corte de caja eliminado");

    const updtateOrderDetail = await partialUpdateOrder({
      id: data.orderId,
      orderStateId: OrderStates.hasRoute,
    });

    if (!updtateOrderDetail.success) {
      toast.error(updtateOrderDetail.message);
      return;
    }

    await getDetailsByCashReportId(data.cashReportId, setError);

    await client.refetchQueries({
      queryKey: [QueryKeys.CashReports],
      type: "active",
      exact: true,
    });

    await client.refetchQueries({
      queryKey: [QueryKeys.OrdersHasRoute],
      type: "active",
      exact: true,
    });

    await client.invalidateQueries({
      queryKey: [QueryKeys.Orders],
      type: "all",
      exact: false,
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly className="bg-transparent text-cyan-500">
          <Icon name="bi bi-three-dots-vertical" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="copy"
          startContent={<Icon name="bi bi-clipboard-check" />}
          onClick={() => copyToClipboard(data.id)}
        >
          Copiar
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          content="Eliminar"
          startContent={<Icon name="bi bi-trash3" />}
          onClick={handleDelete}
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
