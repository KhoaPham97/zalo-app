export interface UserInfo {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
}

export interface Product {
  _id: number;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: Category;
  detail?: string;
  sizes?: Size[];
  colors?: Color[];
}

export interface Category {
  _id: number;
  id: number;
  name: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Cart = CartItem[];

export interface Location {
  lat: number;
  lng: number;
}

export interface ShippingAddress {
  alias: string;
  address: string;
  name: string;
  phone: string;
}

export interface Station {
  id: number;
  name: string;
  image: string;
  address: string;
  location: Location;
}

export type Delivery =
  | ({
      type: "shipping";
    } & ShippingAddress)
  | ({
      type: "pickup";
    } & Station);

export type OrderStatus = "pending" | "shipping" | "completed";

export interface Order {
  id: number;
  status: OrderStatus;
  createdAt: Date;
  receivedAt: Date;
  items: CartItem[];
  delivery: Delivery;
  total: number;
  note: string;
}
