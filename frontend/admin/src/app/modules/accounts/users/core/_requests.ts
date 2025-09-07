import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'
import apiMultipart from "@@@@/apiMultipart";

export const useUser = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewUserDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/core/user/${id}/edit`);
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


  const updateUser = async  (values: any, id:string, setRefreshTable?: (value: boolean) => void) => {
     try {
        showLoader()

        const res = await apiMultipart.post(`/core/user/${id}/update`, values)

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

  const createUser = async  (
    values: any, 
    resetForm: () => void, 
    setRefreshTable?: (value: boolean) => void,
    setPage?: (page: number) => void
  ) => {
     try {
      showLoader()
      
      const res = await apiMultipart.post('/core/user/store',  values )
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

  const archivedUser = async (
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
      const res = await api.delete(`/core/user/${id}/archive`)
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

  const restoreUser= async  (id: string, setRefreshTable?: (refresh: boolean) => void,setRefreshFirstTable?: (refresh: boolean) => void) => {
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
      const res = await api.post(`/core/user/${id}/restore`)
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


  const resetPasswordUser= async  (id: string, setRefreshTable?: (refresh: boolean) => void) => {
      const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'This user will be reset password.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, reset it!',
      })

      if (!confirmResult.isConfirmed) return

      try {
        showLoader()
        const res = await api.post(`/core/user/${id}/reset`)
        Swal.fire({
          icon: res.data?.status || 'success',
          title: res.data?.message || 'User reset password successfully.',
        })
        setRefreshTable?.(true);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: error?.response?.data?.message || 'Something went wrong.',
        })
      } finally {
        hideLoader()
      }
  }


  return {  viewUserDetails, createUser,  updateUser, archivedUser, restoreUser, resetPasswordUser  }
}