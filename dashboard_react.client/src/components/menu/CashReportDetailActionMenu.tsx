import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";
import { toast } from "react-toastify";
import { partialUpdateOrder } from "../../services/orderService";
import { OrderStates } from "../../config/contants";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorsStore } from "../../store/useErrorsStore";
import { CashReportDetailsResponse } from "../../types/CashReportDetailResponse";
import { useCashReportStore } from "../../store/useCashReportStore";
import { updateCashReportDetail } from "../../services/cashReportDetailService";
import { updateCashReport } from "../../services/cashReportService";

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

    const updateResponse = await updateCashReport({ ...cashReport!, orders: details });

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
      toast.error(response.message);
    }

    toast.success("Detalle de corte de caja eliminado");

    const updtateOrderDetail = await partialUpdateOrder({
      id: data.orderId,
      orderStateId: OrderStates.hasRoute,
    });

    if (!updtateOrderDetail.success) {
      toast.error(updtateOrderDetail.message);
    }

    await getDetailsByCashReportId(data.cashReportId, setError);

    await client.refetchQueries({
      queryKey: ["cashReports"],
      type: "active",
      exact: true,
    });

    await client.refetchQueries({
      queryKey: ["ordersHasRoute"],
      type: "active",
      exact: true,
    });

    await client.invalidateQueries({
      queryKey: ["orders"],
      type: "all",
      exact: false,
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="bg-transparent text-cyan-500" isIconOnly>
          <Icon name="bi bi-three-dots-vertical" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="copy"
          startContent={<Icon name="bi bi-clipboard-check" />}
          onClick={() => copyToClipboard(data.id!)}
        >
          Copiar
        </DropdownItem>
        <DropdownItem
          key="delete"
          onClick={handleDelete}
          startContent={<Icon name="bi bi-trash3" />}
          className="text-danger"
          color="danger"
          content="Eliminar"
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
