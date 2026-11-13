import { useCheckout } from "@/hooks";
import { Button } from "zmp-ui";
import { useState } from "react";

export default function Pay() {
  const checkout = useCheckout();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex-none flex items-center gap-3 border-t border-blue-100 bg-section px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-900">Gửi yêu cầu đặt hàng</div>
        <div className="mt-0.5 text-2xs leading-snug text-subtitle">Chưa thanh toán · Nhân viên sẽ liên hệ xác nhận</div>
      </div>
      <Button
        disabled={submitting}
        loading={submitting}
        onClick={async () => {
          if (submitting) return;
          setSubmitting(true);
          try {
            await checkout();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        Xác nhận đặt
      </Button>
    </div>
  );
}
