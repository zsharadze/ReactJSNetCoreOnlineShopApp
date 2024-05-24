import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import mainLogo from "./../../img/home_logo.png";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ProfileMenuGoTo } from "../../models/profileMenuGoToEnum";
import BuildIcon from "@mui/icons-material/Build";
import ProfileMenuLayout from "./LayoutProfileMenu";

const drawerWidth = 80;

export default function LayoutProductDetails({ children, ...props }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const shoppingCart = useSelector((state: RootState) => state.shoppingCart);

  const handleMenuClose = (goTo: ProfileMenuGoTo) => {
    setAnchorEl(null);
    navigate({
      pathname: "/profilemenunavigator",
      search: createSearchParams({
        goToUrl: goTo.toString(),
      }).toString(),
    });
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const naviageToMainPage = () => {
    if (location.pathname === "/") {
      navigate(0);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box sx={{ zIndex: 1059, pl: "20px", pt: "10px", cursor: "pointer" }}>
          <img
            onClick={() => {
              naviageToMainPage();
            }}
            className="main-logo"
            src={mainLogo}
            alt="main logo"
            style={{ position: "fixed" }}
          />
        </Box>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <Box sx={{ cursor: "pointer" }} onClick={() => naviageToMainPage()}>
              React Shop
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                onClick={() => {
                  navigate("/shoppingcart");
                }}
              >
                {shoppingCart?.shoppingCart ? (
                  <Badge
                    badgeContent={shoppingCart?.shoppingCart?.length}
                    color="error"
                  >
                    <ShoppingCartIcon />
                  </Badge>
                ) : (
                  <ShoppingCartIcon />
                )}
              </IconButton>
              <IconButton
                size="large"
                aria-label="admin"
                color="inherit"
                onClick={() => {
                  navigate("/admin");
                }}
              >
                <BuildIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <ProfileMenuLayout
          anchorEl={anchorEl}
          menuId={menuId}
          isMenuOpen={isMenuOpen}
          handleMenuClose={handleMenuClose}
        />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            // overflowY: "scroll",
          }}
        >
          <Toolbar />
          <div>{children}</div>
        </Box>
      </Box>
    </>
  );
}
