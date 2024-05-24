export interface PromoCode {
  id: number;
  promoCodeText: string;
  isUsed: boolean;
  createdDate: Date;
  discount: number;
  usedByUserEmail: string;
  usedOnOrderId: number;
}
