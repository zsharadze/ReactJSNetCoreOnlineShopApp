import { Order } from "./order";
import { Product } from "./product";

export interface OrderItem {
  id?: number;
  name?: string;
  description?: string;
  quantity?: number;
  productId?: number;
  price?: number;
  product?: Product;
  orderId?: number;
  productImageSrc?: string;
  order?: Order;
}
