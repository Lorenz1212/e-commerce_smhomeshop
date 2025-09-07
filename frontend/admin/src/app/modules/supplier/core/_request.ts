import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'


export const useSupplierRequest = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewSupplierDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/admin/supplier/${id}/edit`);
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

  const updateSupplier = async  (params: any, id:string, setRefreshTable?: (value: boolean) => void) => {
     try {
        showLoader()
        const res = await api.put(`/admin/supplier/${id}/update`, params)
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

  const createSupplier = async  (
    params: any, 
    resetForm: () => void, 
    setRefreshTable?:(value: boolean) => void,
    setPage?: (page: number) => void
  ) => {
     try {
      showLoader()
      const res = await api.post('/admin/supplier/store',  params )
      Swal.fire({
        icon:  res.data?.status,
        title: res.data?.message,
      })
      if(res.data?.status == 'success'){
        resetForm();
        setRefreshTable?.(true)
        setPage?.(1);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message,
      })
    } finally{
      hideLoader()
    }
  }

  const archivedSupplier = async (id: string, setRefreshTable?: (refresh: boolean) => void) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive the supplier.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.delete(`/admin/supplier/${id}/delete`)
      Swal.fire({
        icon: res.data?.status || 'success',
        title: res.data?.message || 'Supplier archived successfully.',
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

  const restoreSupplier =async  (id: string, setRefreshTable?: (refresh: boolean) => void,setRefreshFirstTable?: (refresh: boolean) => void) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the archived supplier.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, restore it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.post(`/admin/supplier/${id}/restore`)
      Swal.fire({
        icon: res.data?.status || 'success',
        title: res.data?.message || 'Supplier restored successfully.',
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

  return { viewSupplierDetails, createSupplier,  updateSupplier, archivedSupplier, restoreSupplier  }
}