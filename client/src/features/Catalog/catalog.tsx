import ProductList from "./productList";

import { useEffect } from "react";

import Loading from "../../app/layout/Loading";
import { asyncFetchProducts, productSelectors } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import ServerError from "../../app/errors/ServerError";

const Catalog = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);
  useEffect(() => {
    if (!productsLoaded) {
      dispatch(asyncFetchProducts);
    }
  }, [productsLoaded, dispatch]);
  if (status.includes("pending")) return <Loading message="Loading products" />;
  if (!productsLoaded) return <ServerError />;
  return (
    <>
      <ProductList products={products} />
    </>
  );
};
export default Catalog;
