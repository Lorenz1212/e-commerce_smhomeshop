export interface ProductModel {
  id_encrypted: string;
  sku: string;
  name: string;
  category_id: number;
  quantity_on_hand: number;
  reorder_point: number;
  supplier_id: number;
  cost_price: number;
  selling_price: number;
  is_active: string;
  image_cover: string;
  color:string,
  status:string,
}