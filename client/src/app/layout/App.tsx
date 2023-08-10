import { useContext, useEffect, useState } from "react";
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
import { setBasket } from "../../features/Basket/basketSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cookie = getCookie("buyerId");
    if (cookie) {
      agent.Basket.getBasket()
        .then((item) => dispatch(setBasket(item)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);
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
