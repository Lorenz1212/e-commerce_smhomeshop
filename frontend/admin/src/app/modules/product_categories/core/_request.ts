import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'
import apiMultipart from "@@@@/apiMultipart";

export const useProductCategory = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewProductCategoryDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/admin/product_category/${id}/edit`);
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

    const updateProductCategory = async  (values: any, id:string, setRefreshTable?: (value: boolean) => void) => {
     try {
        showLoader()
        
        const formData = new FormData()

        const fields = [
          'name'
        ]

        fields.forEach((field) => formData.append(field, values[field]))

        values.images.forEach((file: File) => {
          formData.append('images[]', file)
        })

        const res = await apiMultipart.post(`/admin/product_category/${id}/update`, formData)

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

  const createProductCategory  = async  (
    values: any, 
    resetForm: () => void, 
    setRefreshTable?: (value: boolean) => void,
    setPage?: (page: number) => void
  ) => {
     try {
      showLoader()
      
      const formData = new FormData()

      const fields = [
        'name'
      ]
      fields.forEach((field) => formData.append(field, values[field]))

      // Append images
      values.images.forEach((file: File) => {
        formData.append('images[]', file)
      })
      const res = await apiMultipart.post('/admin/product_category/store',  formData )
      Swal.fire({
        icon:  res.data?.status,
        title: res.data?.message,
      })
      if(res.data?.status == 'success'){
        resetForm();
        setRefreshTable?.(true);
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

  const archivedProductCategory = async (
    id: string, 
    setRefreshTable?: (refresh: boolean) => void
  ) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive the item.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.delete(`/admin/product_category/${id}/delete`)
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

  const restoreProductCategory = async  (id: string, setRefreshTable?: (refresh: boolean) => void,setRefreshFirstTable?: (refresh: boolean) => void) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the archived item.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, restore it!',
    })

    if (!confirmResult.isConfirmed) return

    try {
      showLoader()
      const res = await api.post(`/admin/product_category/${id}/restore`)
      Swal.fire({
        icon: res.data?.status || 'success',
        title: res.data?.message || 'Item restored successfully.',
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

  return { viewProductCategoryDetails, createProductCategory,  updateProductCategory, archivedProductCategory, restoreProductCategory  }
}