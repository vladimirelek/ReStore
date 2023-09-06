import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./productCard";
import { useAppSelector } from "../../app/store/store";
import ProductSceleton from "./ProductSceleton";
interface Props {
  products: Product[];
}
const ProductList = ({ products }: Props) => {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={4} key={product.id}>
          {!productsLoaded ? (
            <ProductSceleton />
          ) : (
            <ProductCard product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
export default ProductList;
