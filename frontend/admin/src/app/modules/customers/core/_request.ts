import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'
import apiMultipart from "@@@@/apiMultipart";

export const useCustomer = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewCustomerDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/admin/customer/${id}/edit`);
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


  const updateCustomer = async  (values: any, id:string, setRefreshTable?: (value: boolean) => void) => {
     try {
        showLoader()

        const res = await apiMultipart.post(`/admin/customer/${id}/update`, values)

        Swal.fire({
          icon:  res.data?.status,
          title: res.data?.message,
        })

        setRefreshTable?.(true);

      } catch (error: any) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error?.response?.data?.message,
        })
      } finally{
        hideLoader()
      }
  }


  const archivedCustomer = async (
    id: string, 
    setRefreshTable?: (refresh: boolean) => void
  ) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.delete(`/admin/customer/${id}/archive`)
      Swal.fire({
        icon: res.data?.status || 'success',
        title: res.data?.message,
      })
      setRefreshTable?.(true);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message || 'An error occurred.',
      })
    } finally {
      hideLoader()
    }
  }

  const restoreCustomer= async  (id: string, 
    setRefreshTable?: (refresh: boolean) => void,
    setRefreshFirstTable?: (refresh: boolean) => void
  ) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the archived user.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, restore it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.post(`/admin/customer/${id}/restore`)
      Swal.fire({
        icon: res.data?.status || 'success',
        title: res.data?.message || 'User restored successfully.',
      })
      setRefreshTable?.(true);
      setRefreshFirstTable?.(true);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message || 'Something went wrong.',
      })
    } finally {
      hideLoader()
    }
  }

  return {  viewCustomerDetails,  updateCustomer, archivedCustomer, restoreCustomer }
}