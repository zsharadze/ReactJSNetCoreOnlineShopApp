import { Category } from "./category";

export interface Product {
  id?: number;
  categoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  imageSrc?: string;
  createdDate?: Date;
  category?: Category;
}
