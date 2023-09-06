import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product, productParams } from "../../app/models/product";
import { RootState } from "../../app/store/store";
import { MetaData } from "../../app/models/pagination";
interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: productParams;
  metaData: MetaData | null;
}
const productsAdapter = createEntityAdapter<Product>();
const getAxiosParams = (productParams: productParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);
  if (productParams.brands.length > 0)
    params.append("brands", productParams.brands.toString());
  if (productParams.types.length > 0)
    params.append("types", productParams.types.toString());
  return params;
};
export const asyncFetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProductsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
  try {
    const response = await agent.Catalog.list(params);
    console.log(response);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return await thunkAPI.rejectWithValue({ error: error.data });
  }
});
export const fetchFilters = createAsyncThunk(
  "catalog/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
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
const initParams = () => ({
  pageNumber: 1,
  pageSize: 6,
  orderBy: "name",
  brands: [],
  types: [],
});
export const productSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    status: "idle",
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false;
      state.productParams = {
        ...state.productParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },

    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetProductParams: (state, action) => {
      state.productParams = initParams();
    },
  },
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
      state.status = "idle";
    });
    builder.addCase(fetchFilters.pending, (state, action) => {
      state.status = "pending fetch filters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.filtersLoaded = true;
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
      console.log(action);
    });
  },
});
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
export const {
  setProductParams,
  resetProductParams,
  setMetaData,
  setPageNumber,
} = productSlice.actions;
