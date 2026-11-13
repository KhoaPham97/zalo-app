import { CartItem } from "@/types";
import { List } from "zmp-ui";
import { resolveImageUrl } from "@/utils/image";

function OrderItem(props: CartItem) {
  return (
    <List.Item
      prefix={<img src={resolveImageUrl(props.variant?.thumbnail || props.variant?.image || props.product.thumbnail || props.product.image)} alt="" className="w-14 h-14 rounded-lg object-cover" />}
      suffix={<div className="text-sm font-medium flex items-center h-full">x{props.quantity}</div>}
    >
      <div className="text-sm">{props.product.title || props.product.name}</div>
      {props.variantName && <div className="text-xs text-subtitle mt-1">Phân loại: {props.variantName}</div>}
    </List.Item>
  );
}

export default OrderItem;
