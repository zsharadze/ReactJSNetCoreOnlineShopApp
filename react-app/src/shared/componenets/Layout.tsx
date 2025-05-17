import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import mainLogo from "./../../img/home_logo.png";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getProductsAsync } from "../../redux/productsSlice";
import { RootState } from "../../redux/store";
import { Category } from "../../models/category";
import { getCategoriesAsync } from "../../redux/categoriesSlice";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ProfileMenuGoTo } from "../../models/profileMenuGoToEnum";
import BuildIcon from "@mui/icons-material/Build";
import ProfileMenuLayout from "./LayoutProfileMenu";

const drawerWidth = 240;

export default function Layout({ children, ...props }: any) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  React.useState<null | HTMLElement>(null);
  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useDispatch<any>();
  const categories = useSelector((state: RootState) => state.categories);
  const searchText = React.useRef("");
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>();
  const shoppingCart = useSelector((state: RootState) => state.shoppingCart);
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;
  
  React.useEffect(() => {
    dispatch(getCategoriesAsync(undefined, undefined, undefined));
  }, []);

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

  const handleSearch = React.useCallback(
    debounce((searchTerm, catId) => {
      dispatch(getProductsAsync(catId, undefined, searchText.current, null));
    }, 400), // Debounce for 400 milliseconds
    []
  );

  const handleChange = (event: any) => {
    const searchTerm = event.target.value;
    searchText.current = searchTerm;
    handleSearch(searchTerm, selectedCategoryId);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  function changeCategory(id?: number, name?: string) {
    searchText.current = "";
    setSelectedCategoryId(id);
    dispatch(getProductsAsync(id, undefined, undefined, null));
  }

  const naviageToMainPage = () => {
    if (location.pathname === "/") {
      navigate(0);
    } else {
      navigate("/");
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {categories?.categories?.categoryList.map(
          (item: Category, index: number) => (
            <ListItem
              key={item.id}
              disablePadding
              className={selectedCategoryId === item.id ? "activeCategory" : ""}
              onClick={() => changeCategory(item.id, item.name)}
            >
              <ListItemButton>
                <ListItemIcon>
                  {item.imageName && (
                    <>
                      <img
                        src={imagesUrl + "categories/" + item.imageName}
                        style={{ border: "1", width: "40px", height: "40px" }}
                        alt="productImage"
                      />{" "}
                      <Box ml={2}>{item.name}</Box>
                    </>
                  )}
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  return (
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>{" "}
          <Box sx={{ cursor: "pointer" }} onClick={() => naviageToMainPage()}>
            React Shop
          </Box>
          <Typography variant="h6" noWrap component="div">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                onChange={(e) => {
                  handleChange(e);
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
          //sx={{ display: { xs: "none", md: "flex" } }}//es patara ekranze top-right iconkebs malavda
          >
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
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
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
  );
}
