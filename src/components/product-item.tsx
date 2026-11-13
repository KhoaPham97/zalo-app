import { Product } from "@/types";
import TransitionLink from "./transition-link";
import { useNavigate } from "react-router-dom";
import { Button } from "zmp-ui";
import { useAddToCart } from "@/hooks";
import QuantityInput from "./quantity-input";

export interface ProductItemProps {
  product: Product;
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const navigate = useNavigate();
  const { addToCart, cartQuantity } = useAddToCart(props.product);
  const hasVariants = Array.isArray(props.product.variants) && props.product.variants.length > 0;

  return (
    <div className="flex flex-col cursor-pointer group bg-section rounded-2xl border border-black/5 overflow-hidden">
      <TransitionLink
        to={`/product/${props.product._id}`}
        replace={props.replace}
        className="p-2 pb-1"
      >
        {({ isTransitioning }) => (
          <>
            <img
              src={props.product.thumbnail}
              className="w-full aspect-square object-cover rounded-xl bg-background"
              style={{ viewTransitionName: isTransitioning ? `product-image-${props.product._id}` : undefined }}
              alt={props.product.title}
              loading="lazy"
            />
            <div className="pt-2 pb-1">
              <div className="text-xs min-h-9 line-clamp-2 font-medium">{props.product.title}</div>
              <div className="mt-1 text-2xs text-subtitle">
                {Number(props.product.qty || 0) > 0 ? `Còn hàng: ${props.product.qty}` : "Liên hệ kiểm tra hàng"}
              </div>
            </div>
          </>
        )}
      </TransitionLink>
      <div className="p-2 pt-1 mt-auto">
        {hasVariants ? (
          <Button variant="secondary" size="small" fullWidth onClick={() => navigate(`/product/${props.product._id}`)}>
            Chọn phân loại
          </Button>
        ) : cartQuantity === 0 ? (
          <Button variant="secondary" size="small" fullWidth onClick={() => addToCart(1, { toast: true })}>
            Thêm vào giỏ
          </Button>
        ) : (
          <QuantityInput value={cartQuantity} onChange={addToCart} />
        )}
      </div>
    </div>
  );
}
