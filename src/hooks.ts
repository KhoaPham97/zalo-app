import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { MutableRefObject, useLayoutEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches, useNavigate } from "react-router-dom";
import { cartState, deliveryModeState, selectedStationState, shippingAddressState, orderNoteState, orderRefreshState } from "@/state";
import { Product, ProductVariant } from "@/types";
import { getConfig } from "@/utils/template";
import { openChat } from "zmp-sdk";
import { API_ENDPOINTS } from "@/api";
import { postRequest } from "@/api/ApiMethod";

export function useRealHeight(element: MutableRefObject<HTMLDivElement | null>, defaultValue?: number) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => setHeight(entries[0].contentRect.height));
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);
  return typeof ResizeObserver === "undefined" ? -1 : height;
}

const variantKey = (variant?: ProductVariant) => variant ? String(variant.variantCode || variant.name || "") : "";

export function useAddToCart(product: Product, variant?: ProductVariant) {
  const [cart, setCart] = useAtom(cartState);
  const key = variantKey(variant);
  const currentCartItem = useMemo(
    () => cart.find((item) => String(item.product?._id) === String(product?._id) && variantKey(item.variant) === key),
    [cart, product?._id, key]
  );
  const addToCart = (quantity: number | ((oldQuantity: number) => number), options?: { toast: boolean }) => {
    setCart((current) => {
      const index = current.findIndex((item) => String(item.product?._id) === String(product?._id) && variantKey(item.variant) === key);
      const oldQuantity = index >= 0 ? current[index].quantity : 0;
      const nextQuantity = typeof quantity === "function" ? quantity(oldQuantity) : quantity;
      if (nextQuantity <= 0) return current.filter((_, itemIndex) => itemIndex !== index);
      if (index >= 0) return current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: nextQuantity } : item);
      return [...current, { product, quantity: nextQuantity, ...(variant ? { variant } : {}) }];
    });
    if (options?.toast) toast.success("Đã thêm vào giỏ hàng");
  };
  return { addToCart, cartQuantity: currentCartItem?.quantity ?? 0 };
}

export function useCustomerSupport() {
  return () => openChat({ type: "oa", id: getConfig((config) => config.template.oaIDtoOpenChat) });
}
export function useToBeImplemented() {
  return () => toast("Chức năng đang được hoàn thiện", { icon: "🛠️" });
}

export function useCheckout() {
  const [cart, setCart] = useAtom(cartState);
  const address = useAtomValue(shippingAddressState);
  const deliveryMode = useAtomValue(deliveryModeState);
  const stationAtom = useMemo(() => loadable(selectedStationState), []);
  const stationResult = useAtomValue(stationAtom);
  const station = stationResult.state === "hasData" ? stationResult.data : undefined;
  const [note, setNote] = useAtom(orderNoteState);
  const refreshOrders = useSetAtom(orderRefreshState);
  const navigate = useNavigate();
  const checkoutLock = useRef(false);

  return async () => {
    if (checkoutLock.current) return;
    checkoutLock.current = true;

    try {
      if (!cart.length) {
        toast.error("Giỏ hàng đang trống");
        return;
      }

      let savedUser: any = {};
      try {
        savedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
      } catch {}

      const customerName = String(address?.name || savedUser?.name || "").trim();
      const customerPhone = String(address?.phone || (typeof savedUser?.phone === "string" ? savedUser.phone : "")).trim();
      const normalizedPhone = customerPhone.replace(/[\s()+.-]/g, "");

      if (deliveryMode === "pickup" && (!station || stationResult.state !== "hasData")) {
        toast.error("Chưa tải được điểm nhận hàng. Vui lòng thử lại sau giây lát.");
        return;
      }

      const customerAddress = deliveryMode === "pickup"
        ? String(station?.address || "").trim()
        : String(address?.address || "").trim();

      if (!customerName || !customerPhone || !customerAddress) {
        toast.error("Vui lòng nhập tên, số điện thoại và địa chỉ nhận hàng trước khi đặt");
        navigate("/shipping-address");
        return;
      }

      if (!/^\d{9,12}$/.test(normalizedPhone)) {
        toast.error("Số điện thoại chưa hợp lệ. Vui lòng kiểm tra lại.");
        navigate("/shipping-address");
        return;
      }

      const deliveryNote = deliveryMode === "pickup"
        ? `Nhận tại cửa hàng: ${station?.name || ""} - ${customerAddress}`
        : `Giao tận nơi: ${customerAddress}`;

      const payload = {
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod: "cod",
        note: [deliveryNote, String(note || "").trim()].filter(Boolean).join(" | "),
        items: cart.map((item) => ({
          productId: String(item.product._id),
          qty: item.quantity,
          variantName: item.variant?.name || "",
          variantCode: item.variant?.variantCode || "",
        })),
      };

      const response: any = await postRequest({ url: API_ENDPOINTS.ORDERS, data: payload });
      if (!response || response.response || response.success !== true || !response.order) {
        toast.error(response?.response?.data?.message || response?.message || "Không thể gửi đơn hàng. Vui lòng thử lại.");
        return;
      }

      setCart([]);
      setNote("");
      refreshOrders((value) => value + 1);
      toast.success(`Đã gửi đơn hàng ${response.order.code || ""}. Nhân viên sẽ liên hệ xác nhận.`, { duration: 5000 });
      navigate("/orders/pending", { viewTransition: true });
    } catch (error: any) {
      console.error("Zalo checkout error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Có lỗi khi gửi đơn hàng. Vui lòng thử lại.");
    } finally {
      checkoutLock.current = false;
    }
  };
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<undefined, {
    title?: string | Function; logo?: boolean; search?: boolean; noFooter?: boolean; noBack?: boolean;
    noFloatingCart?: boolean; scrollRestoration?: number;
  } | undefined>[];
  const lastMatch = matches[matches.length - 1];
  return [lastMatch.handle, lastMatch, matches] as const;
}
