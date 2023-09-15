import { Grid, Link, Typography } from "@mui/material";
import BasketSummary from "../Basket/BasketSummary";
import basket from "../Basket/basket";
import BasketTable from "../Basket/basketTable";
import { useAppSelector } from "../../app/store/store";

export default function Review() {
  const { basket } = useAppSelector((state) => state.basket);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && <BasketTable items={basket.items} isBasket={false} />}
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </>
  );
}
