import { AppBar, Badge, IconButton, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import "./header.css";
import { ShoppingCart } from "@mui/icons-material";
import { useAppSelector } from "../../store/store";
import SignedInMenu from "../SignedInMenu";
interface Props {
  darkMode: boolean;
  switchTheme: () => void;
}
const Header = ({ darkMode, switchTheme }: Props) => {
  const { user } = useAppSelector((state) => state.account);
  const { basket } = useAppSelector((state) => state.basket);
  const iconQuantity = basket?.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <div className="all-links">
        <div className="left-links">
          <Link className="left-link" to={"/"}>
            RE-STORE
          </Link>
          <Switch
            className="left-link"
            checked={darkMode}
            onChange={switchTheme}
          />
        </div>
        <div className="center-links">
          <Link className="center-link" to={"/catalog"}>
            CATALOG
          </Link>
          <Link className="center-link" to={"/about"}>
            ABOUT
          </Link>
          <Link className="center-link" to={"/contact"}>
            CONTACT
          </Link>
        </div>
        <div className="right-links">
          <Link to={"basket"}>
            <IconButton
              className="right-link"
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={iconQuantity} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>
          {user ? (
            <SignedInMenu />
          ) : (
            <>
              <Link className="right-link-auth" to={"/login"}>
                LOGIN
              </Link>
              <Link className="right-link-auth" to={"/register"}>
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </AppBar>
  );
};
export default Header;
