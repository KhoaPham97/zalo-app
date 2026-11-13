import HorizontalDivider from "@/components/horizontal-divider";
import Section from "@/components/section";
import { Order } from "@/types";
import CollapsibleOrderItems from "./collapsible-order-items";
import { useNavigate } from "react-router-dom";

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

function OrderSummary(props: { order: Order; full?: boolean }) {
  const navigate = useNavigate();
  const status = String(props.order.status || "pending");
  const created = props.order.createdAt ? new Date(props.order.createdAt) : new Date();
  return (
    <Section
      title={
        <div className="w-full flex justify-between items-center gap-2 font-normal">
          <span className="text-xs truncate">#{props.order.code || props.order.id} · {created.toLocaleDateString("vi-VN")}</span>
          <span className="text-primary text-xs whitespace-nowrap">{statusLabels[status] || status}</span>
        </div>
      }
      className="flex-1 overflow-y-auto rounded-xl border border-black/5"
      onClick={() => {
        if (!props.full) navigate(`/order/${props.order.id}`, { state: props.order, viewTransition: true });
      }}
    >
      <div className="w-full">
        <CollapsibleOrderItems items={props.order.items} defaultExpanded={props.full} />
      </div>
      <HorizontalDivider />
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-subtitle">Số mặt hàng</span>
        <span className="text-sm font-semibold">{props.order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </div>
    </Section>
  );
}

export default OrderSummary;
