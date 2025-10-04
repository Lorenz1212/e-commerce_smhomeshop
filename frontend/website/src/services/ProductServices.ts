import api from "@/utils/api";
import { useLoader } from "@/components/LoaderContext";
import Swal from 'sweetalert2'
import { ProductModel, CartItem, DataTableResponse } from "@/Model/DataModel";

export const useProduct = () => {

  const { showLoader, hideLoader } = useLoader();

  const fetchProducts = async (
    page:number,
    category?: string,
    brands?: string[],
    minPrice?: number,
    maxPrice?: number,
    sortOption?:any    
  ) => {
    try {
      showLoader();
      const response = await api.post<DataTableResponse>("/web/product/list", {
          page:page,
          category: category,
          brands: brands,
          minPrice: minPrice,
          maxPrice: maxPrice,
          sort:sortOption
      });
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Failed to fetch products",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  const fetchProductDetails = async (
    product_id:any
  ) => {
    try {
      showLoader();
      const response = await api.get<ProductModel>(`/web/product/${product_id}/details`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Failed to fetch products",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  const fetchProductRelated = async (
    product_id:any
  ) => {
    try {
      showLoader();
      const response = await api.get<ProductModel[]>(`/web/product/${product_id}/related`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Failed to fetch products",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  return { fetchProducts, fetchProductDetails, fetchProductRelated };
};