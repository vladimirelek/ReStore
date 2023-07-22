import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./productList";

import { useState, useEffect } from "react";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/product")
      .then((items) => items.json())
      .then((response) => setProducts(response));
  }, []);
  return (
    <>
      <ProductList products={products} />
    </>
  );
};
export default Catalog;
