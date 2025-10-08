import { PaginationMeta } from "@/utils/types";

export interface CategoryModel {
  id: number;
  name: string;
  image_cover: string;
}

export interface BrandModel {
  id: number;
  name: string;
  image_cover: string;
  product_count:number;
}

export interface PriceRangeModel {
  minPrice: number;
  maxPrice: number;
}

export interface ProductModel {
  data:any;
  id_encrypted: number;
  name: string;
  sku: string;
  description:string;
  long_description:string;
  selling_price: number;
  front_image?: string;
  back_image?: string;
  reviews_count?: number;
  image_cover?:string;
  primary_image?:any;
  variants_min_selling_price:number;
  variants_max_selling_price:number;
  quantity_on_hand:number;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  variants?:any;
  images?:any;
  product_addons?:any;
}

export interface CartItem {
  product_id: any;
  variant_id: string | number | null;
  quantity: number;
  addons?: {
    addon_id: string;
    is_freebie: boolean;
  }[];
}

export interface DataTableResponse {
  data: ProductModel[];
  pagination: PaginationMeta;
}


export interface AddressModel {
  value: number;
  label: string;
}

export interface CustomerAddressModel {
  id_encrypted:string;
  full_address: string;
  company_name: string;
  address: string;
  region_code: string;
  province_code: string;
  city_code: string;
  brgy_code: string;
  postal_code: string;
}
