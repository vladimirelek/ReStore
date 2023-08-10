import { useState } from "react";

import agent from "../../app/api/agent";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

const BasketPage = () => {
  const dispatch = useAppDispatch();
  const { basket, status } = useAppSelector((state) => state.basket);

  if (!basket) return <h1>Your basket is empty</h1>;
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" align-items="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {(item.price / 100).toFixed(2)}$
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    loading={status === "pending" + item.productId}
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                        })
                      )
                    }
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    loading={status === "pending" + item.productId}
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({
                          productId: item.productId,
                        })
                      )
                    }
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  {((item.price / 100) * item.quantity).toFixed(2)}$
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                        })
                      )
                    }
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Link to={"/checkout"}>
            <Button variant="contained" size="large" fullWidth>
              Checkout
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default BasketPage;
