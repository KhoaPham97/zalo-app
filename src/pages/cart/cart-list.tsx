import { useAtom, useAtomValue } from "jotai";
import { cartState, orderNoteState } from "@/state";
import CartItem from "./cart-item";
import Section from "@/components/section";
import { Icon } from "zmp-ui";
import HorizontalDivider from "@/components/horizontal-divider";
export default function CartList() {
  const cart = useAtomValue(cartState);
  const [note, setNote] = useAtom(orderNoteState);
  return (
    <Section title={<div className="flex items-center gap-2"><Icon icon="zi-shopping-cart" /><span className="font-semibold text-sm">Sản phẩm đã chọn ({cart.length})</span></div>} className="flex-1 overflow-y-auto rounded-lg">
      <div className="w-full">
        {cart.map((item) => <CartItem key={`${item.product._id}-${item.variant?.variantCode || item.variant?.name || "default"}`} {...item} />)}
      </div>
      <HorizontalDivider />
      <div className="px-4 py-3 space-y-2">
        <label className="text-sm font-medium" htmlFor="order-note">Ghi chú cho cửa hàng</label>
        <textarea id="order-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: cần tư vấn đúng đời xe, gọi trước khi giao..." rows={2} className="w-full rounded-lg bg-background border border-black/10 p-3 text-sm outline-none resize-none" />
      </div>
    </Section>
  );
}
