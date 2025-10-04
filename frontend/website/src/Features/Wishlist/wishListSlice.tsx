import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishList: (state:any, action:any) => {
      state.items.push(action.payload);
    },
    removeFromWishList: (state:any, action:any) => {
      state.items = state.items.filter((item:any) => item.id !== action.payload.id);
    },
    clearWishList: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishList, removeFromWishList, clearWishList } =
  wishListSlice.actions;

export default wishListSlice.reducer;
