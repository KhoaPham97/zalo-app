import { useCheckout } from "@/hooks";
import { Button } from "zmp-ui";
import { useState } from "react";

export default function Pay() {
  const checkout = useCheckout();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex-none flex items-center gap-3 py-3 px-4 bg-section border-t border-black/5">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">Gửi yêu cầu đặt hàng</div>
        <div className="text-2xs text-subtitle mt-0.5">Chưa thanh toán · Chờ nhân viên xác nhận</div>
      </div>
      <Button
        disabled={submitting}
        loading={submitting}
        onClick={async () => {
          setSubmitting(true);
          try { await checkout(); } finally { setSubmitting(false); }
        }}
      >
        Đặt hàng
      </Button>
    </div>
  );
}
