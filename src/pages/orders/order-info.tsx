import { HomeIcon, LocationMarkerLineIcon } from "@/components/vectors";
import { Order } from "@/types";
import { Icon, List } from "zmp-ui";
import DeliverySummary from "../cart/delivery-summary";

function OrderInfo(props: { order: Order }) {
  const note = String(props.order.note || "");
  const pickupMatch = note.match(/^Nhận tại cửa hàng:\s*(.*?)\s*-\s*(.*?)(?:\s*\|\s*|$)/);
  const customerNote = note
    .replace(/^Nhận tại cửa hàng:\s*.*?(?:\s*\|\s*|$)/, "")
    .replace(/^Giao tận nơi:\s*.*?(?:\s*\|\s*|$)/, "")
    .trim();

  return (
    <List noSpacing className="rounded-xl border border-black/5 bg-section">
      {pickupMatch ? (
        <DeliverySummary
          icon={<HomeIcon />}
          title="Nhận hàng tại cửa hàng"
          subtitle={pickupMatch[1]}
          description={pickupMatch[2]}
        />
      ) : (
        <DeliverySummary
          icon={<LocationMarkerLineIcon />}
          title="Địa chỉ nhận hàng"
          subtitle={props.order.delivery.alias}
          description={props.order.delivery.address}
        />
      )}
      {customerNote && (
        <List.Item prefix={<Icon icon="zi-note" />} title="Ghi chú">
          <span className="text-xs text-inactive">{customerNote}</span>
        </List.Item>
      )}
    </List>
  );
}

export default OrderInfo;
