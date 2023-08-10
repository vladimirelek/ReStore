import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import Loading from "../../app/layout/Loading";
import {
  Grid,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from "../Basket/basketSlice";
import { asyncFetchProduct, productSelectors } from "./catalogSlice";
import NotFound from "../../app/errors/NotFound";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) =>
    productSelectors.selectById(state, id!)
  );
  const [quantity, setQuantity] = useState<number>(0);
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const { basket, status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const item = basket?.items.find((item) => item.productId === product?.id);
  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) dispatch(asyncFetchProduct(parseInt(id)));
  }, [id, item, dispatch, product]);
  const handleBox = (event: any) => {
    if (event.target.value > 0) {
      setQuantity(event.target.value);
    }
  };
  const handleUpdateItem = () => {
    const updatedQuantity = item ? quantity - item.quantity : quantity;
    if (!item || quantity > item?.quantity) {
      dispatch(
        addBasketItemAsync({
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemAsync({
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    }
  };

  if (productStatus.includes("pending"))
    return <Loading message={"Loading product"} />;
  if (!product) return <NotFound />;
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product?.pictureUrl}
          alt={product?.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product?.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product?.price! / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody sx={{ fontSize: "1.1em" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product?.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product?.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product?.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant={"outlined"}
              type={"number"}
              label={"Quantity in Cart"}
              fullWidth
              value={quantity}
              onChange={handleBox}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              sx={{ height: "55px" }}
              color={"primary"}
              size={"large"}
              variant={"contained"}
              fullWidth
              onClick={handleUpdateItem}
              loading={status.includes("pendingItem" + product?.id)}
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ProductDetails;
