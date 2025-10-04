import { ProductModel, CategoryModel } from "@/Model/DataModel";
import api from "@/utils/api";

export const fetchAllProducts = async (): Promise<ProductModel[]> => {
  const res = await api.get<ProductModel[]>(`/web/home/product_all`);
  return res.data;
};

export const fetchNewArrivals = async (): Promise<ProductModel[]> => {
  const res = await api.get<ProductModel[]>(`/web/home/new_arrival`);
  return res.data;
};

export const fetchBestSellers = async (): Promise<ProductModel[]> => {
  const res = await api.get<ProductModel[]>(`/web/home/best_seller`);
  return res.data;
};

export const fetchCategory = async (): Promise<CategoryModel[]> => {
  const res = await api.get<CategoryModel[]>(`/category`);
  return res.data;
};
