export interface UserInfo { name: string; avatar: string; phone: string; email: string; address: string; }
export interface ProductVariant { _id?: string; name: string; variantCode?: string; sku?: string; price?: number | string; qty?: number; weight?: number; thumbnail?: string; image?: string; packageQuantity?: number; }
export interface Product {
  _id: string | number; id?: string | number; title: string; name?: string; price: number | string; originalPrice?: number | string;
  thumbnail: string; image?: string; images?: string[]; category?: string | { name?: string }; categoryId?: string;
  detail?: string; description?: string; brand?: string; type?: string; qty?: number; stock?: string; rating?: number;
  soldQty?: number; variants?: ProductVariant[]; compatibleVehicles?: string[]; created_at?: string | Date; updated_at?: string | Date; isVisible?: boolean;
}
export interface Category { _id: string | number; id: string | number; name: string; image: string; type?: string; }
export interface CartItem { product: Product; quantity: number; variant?: ProductVariant; }
export type Cart = CartItem[];
export type Location = { lat: number; lng: number };
export interface ShippingAddress { alias: string; address: string; name: string; phone: string; }
export interface Station { id: number; name: string; image: string; address: string; location: Location; }
export type Delivery = ({ type: "shipping" } & ShippingAddress) | ({ type: "pickup" } & Station);
export type OrderStatus = "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
export interface Order { id: string; code?: string; status: OrderStatus; createdAt: Date; items: CartItem[]; delivery: Delivery; total?: number; note: string; }
