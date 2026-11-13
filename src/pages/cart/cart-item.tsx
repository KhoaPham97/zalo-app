import { useAddToCart } from "@/hooks";
import { CartItem as CartItemProps } from "@/types";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useEffect, useState } from "react";
import { Icon } from "zmp-ui";
import { resolveImageUrl } from "@/utils/image";

const SWIPE_TO_DELTE_OFFSET = 80;

export default function CartItem(props: CartItemProps) {
  const [quantity, setQuantity] = useState(props.quantity);
  const { addToCart } = useAddToCart(props.product, props.variant);

  useEffect(() => {
    addToCart(quantity);
  }, [quantity]);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(({ last, offset: [ox] }) => {
    if (last) api.start({ x: ox < -SWIPE_TO_DELTE_OFFSET ? -SWIPE_TO_DELTE_OFFSET : 0 });
    else api.start({ x: Math.min(ox, 0), immediate: true });
  }, {
    from: () => [x.get(), 0],
    axis: "x",
    bounds: { left: -100, right: 0, top: 0, bottom: 0 },
    rubberband: true,
    preventScroll: true,
  });

  return (
    <div className="relative after:border-b-[0.5px] after:border-black/10 after:absolute after:left-[88px] after:right-0 after:bottom-0 last:after:hidden">
      <div className="absolute right-0 top-0 bottom-0 w-20 py-px">
        <button className="bg-danger text-white/95 w-full h-full flex flex-col space-y-1 justify-center items-center" onClick={() => addToCart(0)}>
          <Icon icon="zi-delete" />
          <span className="text-2xs font-medium">Xoá</span>
        </button>
      </div>
      <animated.div {...bind()} style={{ x }} className="bg-white p-4 flex items-center space-x-3 relative">
        <img src={resolveImageUrl(props.variant?.thumbnail || props.variant?.image || props.product.thumbnail || props.product.image)} alt={props.product.title || props.product.name || ""} className="w-14 h-14 rounded-lg object-cover" />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-sm line-clamp-2">{props.product.title || props.product.name}</div>
          {props.variant?.name && <div className="text-xs text-subtitle">Phân loại: {props.variant.name}</div>}<div className="text-xs text-subtitle">Số lượng: {quantity}</div>
        </div>
        <div className="text-sm font-medium">x{quantity}</div>
      </animated.div>
    </div>
  );
}
