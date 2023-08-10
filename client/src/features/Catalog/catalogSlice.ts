import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/store";
const productsAdapter = createEntityAdapter<Product>();
export const asyncFetchProducts = createAsyncThunk<Product[]>(
  "catalog/fetchProductsAsync",
  async (_, thunkAPI) => {
    try {
      return agent.Catalog.list();
    } catch (error: any) {
      return await thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
export const asyncFetchProduct = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
export const productSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncFetchProducts.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(asyncFetchProducts.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(asyncFetchProducts.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(asyncFetchProduct.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(asyncFetchProduct.fulfilled, (state, action) => {
      state.status = "idle";
      productsAdapter.upsertOne(state, action);
    });
    builder.addCase(asyncFetchProduct.rejected, (state, action) => {
      console.log(action);
      state.status = "idle";
    });
  },
});
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
