import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/StoreContext/store-context";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setBasket } = useStoreContext();
  function handleAddItems(productId: number, quantity = 1) {
    setLoading(true);
    agent.Basket.addItem(productId, quantity)
      .then((item) => setBasket(item))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand}/{product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={loading}
          onClick={() => handleAddItems(product.id)}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Link to={`/catalog/${product.id}`}>
          <Button size="small">View</Button>
        </Link>
      </CardActions>
    </Card>
  );
};
export default ProductCard;
