import { Tabs } from "zmp-ui";
import OrderList from "./order-list";
import { ordersState } from "@/state";
import { OrderStatus } from "@/types";
import { useNavigate, useParams } from "react-router-dom";

const orderTabs = [
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã hủy" },
] as const;

function OrdersPage() {
  const { status } = useParams();
  const activeStatus: OrderStatus = orderTabs.some((tab) => tab.key === status) ? (status as OrderStatus) : "pending";
  const navigate = useNavigate();

  return (
    <Tabs
      className="h-full flex flex-col"
      activeKey={activeStatus}
      onChange={(nextStatus) => navigate(`/orders/${nextStatus}`)}
    >
      {orderTabs.map((tab) => (
        <Tabs.Tab key={tab.key} label={tab.label}>
          <OrderList ordersState={ordersState(tab.key)} />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

export default OrdersPage;
