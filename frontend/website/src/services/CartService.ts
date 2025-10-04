import api from "@/utils/api";
import { useLoader } from "@/components/LoaderContext";
import Swal from 'sweetalert2'
import { ProductModel, CartItem, DataTableResponse } from "@/Model/DataModel";
import { useDispatch, useSelector } from "react-redux";
import { setCartCount } from "@/Features/Cart/cartSlice";
import toast from "react-hot-toast";

export const useCart = () => {
    
  const { showLoader, hideLoader } = useLoader();

  const dispatch = useDispatch();

  const fetchCarts = async () => {
    try {
      showLoader();
      const response = await api.get("/customer/auth/cart/list");
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something wen't wrong ",
      });
      return null;
    } finally {
      hideLoader();
    }
  };
  
  const fetchCartCount = async () => {
    try {
        
      const response = await api.get(`/customer/auth/cart/count`);
      dispatch(setCartCount(response.data));
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something wen't wrong ",
      });
      return null;
    } 
  };

  const storeProductCart = async (
    productDetails:CartItem
  ) => {
    try {
      showLoader();
      const response = await api.post(`/customer/auth/cart/store`,productDetails);

      dispatch(setCartCount(response.data.result));

      toast.success("Added to cart!", { 
        duration: 2000,
        style: { backgroundColor: "#07bc0c", color: "white" },
      });

    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something wen't wrong ",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  const updateProductCartQuantity = async (
    cart_id:string,
    productDetails:CartItem
  ) => {
    try {
      showLoader();
      const response = await api.post(`/customer/auth/cart/update/${cart_id}`,productDetails);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something wen't wrong ",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  const removeProductCart = async (
    cart_id:string,
  ) => {
    try {
      showLoader();
     const response = await api.post(`/customer/auth/cart/remove/${cart_id}`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something wen't wrong ",
      });
      return null;
    } finally {
      hideLoader();
    }
  };

  return { fetchCarts,  fetchCartCount, storeProductCart, updateProductCartQuantity, removeProductCart };
};