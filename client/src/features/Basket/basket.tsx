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

import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";
import BasketTable from "./basketTable";

const BasketPage = () => {
  const { basket } = useAppSelector((state) => state.basket);

  if (!basket) return <h1>Your basket is empty</h1>;
  return (
    <>
      <BasketTable items={basket.items} />
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
