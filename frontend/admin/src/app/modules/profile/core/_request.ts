import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'

export const useProfile = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewProfileDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/core/user/${id}/edit`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.errors,
      })
      return null; 
    } finally{
      hideLoader()
    }
  };

  const changeEmail = async  (values: any) => {
     try {
        showLoader()

        const res = await api.post(`/admin/update_email`, values)

        Swal.fire({
          icon:  res.data?.status,
          title: res.data?.message,
        })
        

        return res.data?.status;

      } catch (error: any) {    

        let message = 'Something went wrong'

        if (error.response?.status === 422 && error.response.data?.errors) {
          message = Object.values(error.response.data.errors)
            .flat()
            .join('\n')
        }

        Swal.fire({
          icon: 'error',
          title: message,
        })
      } finally{
        hideLoader()
      }
  }

  const changePassword = async  (values: any) => {
     try {
        showLoader()

        const res = await api.post(`/admin/change_password`, values)

        Swal.fire({
          icon:  res.data?.status,
          title: res.data?.message,
        })

        return res.data?.status;

      } catch (error: any) {
        let message = 'Something went wrong'

        if (error.response?.status === 422 && error.response.data?.errors) {
          message = Object.values(error.response.data.errors)
            .flat()
            .join('\n')
        }

        Swal.fire({
          icon: 'error',
          title: message,
        })
      } finally{
        hideLoader()
      }
  }

  return {  viewProfileDetails, changeEmail, changePassword}
}