import { OrderItem } from "./orderItem";
import { PromoCode } from "./promoCode";

export interface Order {
  id?: number;
  createdDate?: Date;
  isShipped?: boolean;
  subtotal?: number;
  subtotalWithPromo?: number;
  userId?: string;
  userEmail?: string;
  promoCodeUsed?: string;
  orderItems?: OrderItem[];
  promoCodeId?: number;
  promoCode?: PromoCode;
}
