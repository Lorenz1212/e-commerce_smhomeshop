import { CartItem } from "@/Model/DataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  count: number;
}

const initialState: CartState = {
  items: [],
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { setCartCount, clearCart } = cartSlice.actions;

// selectors
export const selectCartItems = (state: any) => state.cart.items;
export const selectCartCount = (state: any) => state.cart.count;


export default cartSlice.reducer;
