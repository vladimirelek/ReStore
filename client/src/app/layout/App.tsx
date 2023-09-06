import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import agent from "../api/agent";

import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Header from "./Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../util/util";
import Loading from "./Loading";
import { useAppDispatch } from "../store/store";
import { fetchBasketAsync, setBasket } from "../../features/Basket/basketSlice";
import { fetchCurrentUser } from "../../features/Account/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);
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
  if (loading) return <Loading />;
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header switchTheme={switchTheme} darkMode={darkMode} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
