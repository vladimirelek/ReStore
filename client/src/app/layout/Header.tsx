import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
interface Props {
  darkMode: boolean;
  switchTheme: () => void;
}
const Header = ({ darkMode, switchTheme }: Props) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>
        <Switch checked={darkMode} onChange={switchTheme} />
      </Toolbar>
    </AppBar>
  );
};
export default Header;
