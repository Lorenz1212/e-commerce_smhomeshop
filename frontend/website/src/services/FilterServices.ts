import api from "@/utils/api";
import { useLoader } from "@/components/LoaderContext";
import Swal from 'sweetalert2'
import { BrandModel, CategoryModel, PriceRangeModel } from "@/Model/DataModel";

export const useFilter = () => {

  const { showLoader, hideLoader } = useLoader()

  const fetchCategory = async ()=> {
    try {
      const response = await api.get<CategoryModel[]>(`/category`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message,
      })
      return null; 
    }
  };

  const fetchBrands = async ()=> {
    try {
      const response = await api.get<BrandModel[]>(`/brands`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message,
      })
      return null; 
    }
  };

  const fetchPriceRange = async ()=> {
    try {
      showLoader()
      const response = await api.get<PriceRangeModel>(`/pricerange`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message,
      })
      return null; 
    } finally{
      hideLoader()
    }
  };
  return { fetchCategory, fetchBrands, fetchPriceRange }
}