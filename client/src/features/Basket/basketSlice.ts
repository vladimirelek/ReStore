import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
interface types {
  basket: null | Basket;
  status: string;
}
const initialState: types = {
  basket: null,
  status: "idle",
};
export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number }
>("basket/removeBasketItemAsync", async ({ productId, quantity }, thunkAPI) => {
  try {
    return await agent.Basket.removeItem(productId, quantity);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      console.log(action);
      state.status = "pendingItem" + action.meta.arg.productId;
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.basket = action.payload;
    });
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action);
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = "pending" + action.meta.arg.productId;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      state.status = "idle";
      const { productId, quantity } = action.meta.arg;
      const productIndex = state.basket?.items.findIndex(
        (item) => item.productId === productId
      );
      if (productIndex === -1 || productIndex === undefined) return;
      state.basket!.items[productIndex].quantity -= quantity!;
      if (state.basket?.items[productIndex].quantity === 0) {
        state.basket.items.splice(productIndex, 1);
      }
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action);
    });
  },
});

export const { setBasket } = basketSlice.actions;

export default basketSlice.reducer;
