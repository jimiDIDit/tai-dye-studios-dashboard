// Products
export interface Product {
  [key: string]: any;
  id?: number;
  title?: string;
  description?: string;
  type?: string;
  brand?: string;
  collection?: any[];
  category?: string;
  price?: number;
  salesTax?: number;
  shipping?: any;
  sale?: boolean;
  discount?: number;
  stock?: number;
  new?: boolean;
  quantity?: number;
  tags?: any[];
  variants?: Variant[];
  images?: Image[];
  size?: string;
  sku?: Variant['sku'];
}

export interface Variant {
  variant_id?: number;
  id?: number;
  sku?: string;
  size?: string;
  price?: number,
  color?: string;
  image_id?: number;
}

export interface Image {
  image_id?: number;
  id?: number;
  alt?: string;
  src?: string;
  variant_id?: any[];
}
