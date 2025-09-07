export interface WalkinOrderListModel {
  id_encrypted?: any;
  order_no: string;
  customer:string;
  order_date: string;
  subtotal: string;
  tax_amount:string;
  discount_amount:string,
  total_amount:string,
  request_type:string,
  status_format:{
    title:string,
    color:string
  },
}

export interface WalkinOrderDetailsModel {
  id_encrypted?: any;
  queue_number:string;
  order_no: string;
  order_date: string;
  subtotal: number;
  tax_amount:number;
  discount_amount:number,
  total_amount:number,
  request_type:string,
  status_format:{
    title:string,
    color:string
  },
  products:Products[];
}

export interface OnlineOrderListModel {
  id_encrypted?: any;
  customer_name:string;
  order_no: string;
  order_date_format: string;
  subtotal: number;
  tax_amount:number;
  discount_amount:number,
  total_amount:number,
  request_type:string,
  status_format:{
    title:string,
    color:string
  },
}

export interface OnlineOrderDetailsModel {
  id_encrypted?: any;
  queue_number:string;
  customer_name:string;
  order_no: string;
  order_date: string;
  subtotal: number;
  tax_amount:number;
  discount_amount:number,
  total_amount:number,
  request_type:string,
  status_format:{
    title:string,
    color:string
  },
  products:Products[];
}

interface Products {
    name:string,
    quantity:number,
    unit_price:number,
    subtotal:number,
    addons:Addons[]
}

interface Addons {
    name:string,
    unit_price:number,
    subtotal:number,
}