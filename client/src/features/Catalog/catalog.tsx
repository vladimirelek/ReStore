import ProductList from "./productList";

import { useEffect } from "react";

import Loading from "../../app/layout/Loading";
import {
  asyncFetchProducts,
  fetchFilters,
  productSelectors,
  setMetaData,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import ServerError from "../../app/errors/ServerError";
import ProductSearch from "./productSearch";
import { Box, Grid, Pagination, Paper, Typography } from "@mui/material";
import RadioButton from "../../app/components/radioButton";
import CheckBox from "../../app/components/checkBoxButtons";
import AppPagination from "../../app/components/AppPagination";

const Catalog = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectAll);

  const sortOptions = [
    { value: "name", label: "Alphabetical" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "price", label: "Price - Low to high" },
  ];
  const {
    productsLoaded,
    status,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);
  useEffect(() => {
    if (!productsLoaded) dispatch(asyncFetchProducts());
  }, [productsLoaded, dispatch]);
  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch]);

  if (!filtersLoaded) return <Loading message="Loading products" />;
  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2, p: 2 }}>
          <ProductSearch />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButton
            options={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={(e) =>
              dispatch(setProductParams({ orderBy: e.target.value }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBox
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ brands: items }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBox
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ types: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) => {
              dispatch(setPageNumber({ pageNumber: page }));
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default Catalog;
