import { useLocation, useNavigate } from "react-router-dom";
import { Order } from "@/types";
import OrderSummary from "./order-summary";
import OrderInfo from "./order-info";
import { Button } from "zmp-ui";

function OrderDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state as Order | null;

  if (!order?.id || !Array.isArray(order.items)) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="text-4xl">📦</div>
        <div className="text-sm font-semibold">Không tìm thấy thông tin đơn hàng</div>
        <p className="text-xs text-subtitle">Vui lòng quay lại danh sách để mở đơn hàng cần xem.</p>
        <Button onClick={() => navigate("/orders/pending", { replace: true })}>Về danh sách đơn hàng</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 p-3">
      <OrderInfo order={order} />
      <OrderSummary full order={order} />
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
        Nhật Khang Bike sẽ liên hệ xác nhận giá, phí giao hàng và thời gian giao trước khi xử lý đơn. Đơn hàng chưa bị trừ tồn kho khi mới gửi yêu cầu.
      </div>
    </div>
  );
}

export default OrderDetailPage;
