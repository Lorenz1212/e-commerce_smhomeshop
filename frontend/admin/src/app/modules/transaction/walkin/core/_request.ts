import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'

export const useOrder = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewOrderDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/admin/order/walkin/${id}/details`);
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


  return {  viewOrderDetails }
}