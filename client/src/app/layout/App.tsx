import { useState } from "react";
import React, { useEffect } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/Catalog/catalog";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Header from "./Header";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const switchTheme: () => void = () => {
    setDarkMode(!darkMode);
  };
  const palleteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: palleteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header switchTheme={switchTheme} darkMode={darkMode} />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
