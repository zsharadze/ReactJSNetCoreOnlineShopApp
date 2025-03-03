import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getProductAsync } from "../../redux/productsSlice";
import { addOrUpdateCart } from "../../redux/shoppingCartSlice";
import Box from "@mui/material/Box";
import { Button, Paper, Stack, Typography, styled} from "@mui/material";
import QuantityInput from "../../shared/componenets/QuantityInput";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate, useParams } from "react-router-dom";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";

//import {store} from "../../redux/store";

type Params = {
  id: string;
};

function ProductDetails() {
  const params = useParams<Params>();
  const [productId, setProductId] = useState<Number>();
  const dispatch = useDispatch<any>();
  const products = useSelector((state: RootState) => state.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const shoppingCart = useSelector((state: RootState) => state.shoppingCart);
  const [inputQuantity, setInputQuantity] = useState(1);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const navigate = useNavigate();
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;
  const inputQuantityHandler = (
    event: any,
    value: number,
    productId: number
  ) => {
    setInputQuantity(value);
  };

  useEffect(() => {
    setProductId(Number(params.id));
    dispatch(getProductAsync(Number(params.id)));
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      {!loading && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ flexDirection: { xs: "column", md: "row", lg: "row" } }}
        >
          <Item sx={{ textAlign: "center" }}>
            <img
              className="detailsImg"
              src={
                products?.product?.imageName
                  ?imagesUrl + "products/" + products.product.imageName
                  : ""
              }
              alt={products?.product?.name}
            />
          </Item>
          <Item sx={{ marginLeft: { xs: "0px !important" } }}>
            <Box sx={{ color: "black" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                In stock
              </Typography>
            </Box>
            <Box sx={{ fontWeight: "bold", color: "black" }}>
              <Typography variant="h5">
                Price: ${products?.product?.price}
              </Typography>
              {}
            </Box>
            <Box sx={{ fontWeight: "bold", color: "black" }}>
              <Typography variant="h5">Description:</Typography>
              {}
            </Box>
            <Box sx={{ fontSize: "18px" }}>
              {products?.product?.description}
              {}
            </Box>
            <Box sx={{ textAlign: "left", mt: 2 }}>
              <Box sx={{ display: "inline-block" }}>
                <Typography variant="h6">Quantity:&nbsp;&nbsp;</Typography>
              </Box>
              <Box sx={{ display: "inline-block" }}>
                <QuantityInput
                  input={inputQuantity}
                  inputHandler={inputQuantityHandler}
                />
              </Box>
              <Box sx={{ display: "inline-block", verticalAlign: "bottom" }}>
                &nbsp;&nbsp;&nbsp;
                <Button
                  variant="contained"
                  sx={{ display: "inline-block" }}
                  endIcon={<AddShoppingCartIcon />}
                  onClick={() => {
                    dispatch(
                      addOrUpdateCart({
                        productId: productId,
                        quantity: inputQuantity,
                      })
                    );
                    setShowCheckoutButton(true);
                  }}
                >
                  Add To Cart
                </Button>
                <Typography variant="h6" sx={{ display: "inline-block" }}>
                  &nbsp;&nbsp;Ships for free
                </Typography>
              </Box>
            </Box>
            {showCheckoutButton && (
              <Button

                color="warning"
                sx={{ mt: 2, width: "200px" }}
                variant="contained"
                endIcon={<ShoppingCartCheckoutIcon/>}
                onClick={() => {
                  navigate("/shoppingcart");
                }}
              >
                Checkout {shoppingCart.shoppingCart.length}
              </Button>
            )}
          </Item>
        </Stack>
      )}
      <LoaderOverlay loading={loading}/>
    </>
  );
}
export default ProductDetails;
