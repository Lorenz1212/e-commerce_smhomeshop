import api from "@@@@/api";
import Swal from 'sweetalert2'
import { useLoader } from '@@@/LoaderContext'
import apiMultipart from "@@@@/apiMultipart";

export const useProduct = () => {

  const { showLoader, hideLoader } = useLoader()

  const viewProductDetails = async (id:string)=> {
    try {
      showLoader()
      const response = await api.get(`/admin/product/${id}/edit`);
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

  const updateProduct = async  (values: any, id:string, setRefreshTable?: (value: boolean) => void) => {
     try {
        showLoader()
        
        const formData = new FormData()

        const fields = [
          'sku',
          'name',
          'description',
          'brand_id',
          'category_id',
          'supplier_id',
          'add_new_stocks',
          'reorder_point',
          'cost_price',
          'selling_price',
        ]

        fields.forEach((field) => formData.append(field, values[field]))

        values.images.forEach((file: File) => {
          formData.append('images[]', file)
        })

        values.addons.forEach((addon:any, index:any) => {
          formData.append(`addons[${index}][id]`, addon.id)
          formData.append(`addons[${index}][base_price]`, addon.base_price.toString())
          formData.append(`addons[${index}][custom_price]`, addon.custom_price.toString())
        })

        values.variants.forEach((variant:any, index:any) => {
          formData.append(`variants[${index}][id]`, variant.id)
          formData.append(`variants[${index}][sku]`, variant.sku.toString())
          formData.append(`variants[${index}][variant_name]`, variant.variant_name.toString())
          formData.append(`variants[${index}][quantity_on_hand]`, variant.quantity_on_hand.toString())
          formData.append(`variants[${index}][reorder_point]`, variant.reorder_point.toString())
          formData.append(`variants[${index}][cost_price]`, variant.cost_price.toString())
          formData.append(`variants[${index}][selling_price]`, variant.selling_price.toString())
          // ✅ Handle multiple images correctly
          if (variant.image && Array.isArray(variant.image)) {
            variant.image.forEach((file: File) => {
              formData.append(`variants[${index}][image][]`, file);
            });
          } else if (variant.image instanceof File) {
            // ✅ If single file only
            formData.append(`variants[${index}][image][]`, variant.image);
          }
        })

        const res = await apiMultipart.post(`/admin/product/${id}/update`, formData)

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

  const createProduct = async  (
    values: any, 
    resetForm: () => void, 
    setRefreshTable?: (value: boolean) => void,
    setPage?: (page: number) => void
  ) => {
     try {
      showLoader()
      
      const formData = new FormData()

      const fields = [
        'sku',
        'name',
        'description',
        'brand_id',
        'category_id',
        'supplier_id',
        'quantity_on_hand',
        'reorder_point',
        'cost_price',
        'selling_price',
      ]

      fields.forEach((field) => formData.append(field, values[field]))

      // Append images
      values.images.forEach((file: File) => {
        formData.append('images[]', file)
      })

      formData.append("primary_index", values.primary_index)

      values.addons.forEach((addon:any, index:any) => {
        formData.append(`addons[${index}][id]`, addon.id)
        formData.append(`addons[${index}][base_price]`, addon.base_price.toString())
        formData.append(`addons[${index}][custom_price]`, addon.custom_price.toString())
      })

      values.variants.forEach((variant: any, index: number) => {
        formData.append(`variants[${index}][sku]`, variant.sku.toString());
        formData.append(`variants[${index}][variant_name]`, variant.variant_name.toString());
        formData.append(`variants[${index}][quantity_on_hand]`, variant.quantity_on_hand.toString());
        formData.append(`variants[${index}][reorder_point]`, variant.reorder_point.toString());
        formData.append(`variants[${index}][cost_price]`, variant.cost_price.toString());
        formData.append(`variants[${index}][selling_price]`, variant.selling_price.toString());

        // ✅ Handle multiple images correctly
        if (variant.image && Array.isArray(variant.image)) {
          variant.image.forEach((file: File) => {
            formData.append(`variants[${index}][image][]`, file);
          });
        } else if (variant.image instanceof File) {
          // ✅ If single file only
          formData.append(`variants[${index}][image][]`, variant.image);
        }
      });

      const res = await apiMultipart.post('/admin/product/store',  formData )
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

  const archivedProduct = async (
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
      const res = await api.delete(`/admin/product/${id}/archive`)
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

  const restoreProduct = async  (id: string, setRefreshTable?: (refresh: boolean) => void,setRefreshFirstTable?: (refresh: boolean) => void) => {
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
      const res = await api.post(`/admin/product/${id}/restore`)
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

  return {  viewProductDetails, createProduct,  updateProduct, archivedProduct, restoreProduct  }
}