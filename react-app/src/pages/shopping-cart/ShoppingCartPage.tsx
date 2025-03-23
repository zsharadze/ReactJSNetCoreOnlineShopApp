import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeQuantityInCart,
  clearCart,
  getProductsAndAddToStateAsync,
  removeFromCart,
  setLoading,
} from "../../redux/shoppingCartSlice";
import Box from "@mui/material/Box";
import {
  Button,
  FormLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import QuantityInput from "../../shared/componenets/QuantityInput";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import { orderApi, promoCodeApi } from "../../api/apiAndInterceptor";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";

function ShoppingCart() {
  const dispatch = useDispatch<any>();
  const loading = useSelector((state: RootState) => state.shoppingCart.loading);
  const shoppingCart = useSelector((state: RootState) => state.shoppingCart);
  const promoCode = useRef("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<number>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {
    let allAddedProductIds: number[] = [];
    if (shoppingCart.shoppingCart.length > 0) {
      shoppingCart.shoppingCart.forEach((element) => {
        allAddedProductIds.push(element.productId);
      });
      dispatch(getProductsAndAddToStateAsync(allAddedProductIds));
    }

    store.subscribe(() => {
      //console.log("ShoppingCart get state store.getState()", store.getState());
    });
  }, []);
  const inputQuantityHandler = (
    event: any,
    value: number,
    productId: number
  ) => {
    dispatch(
      changeQuantityInCart({
        productId: productId,
        quantity: value,
      })
    );
  };

  const getSubTotalWithPromoCode = () => {
    let subTotal = shoppingCart.shoppingCart.reduce(
      (total, item) => item.totalPrice + total,
      0
    );

    return subTotal - promoCodeDiscount! > 0
      ? subTotal - promoCodeDiscount!
      : 0;
  };

  const handleApplyPromoCode = () => {
    promoCodeApi()
      .getByPromoCodeText(promoCode.current)
      .then((res) => {
        if (res.data === "") {
          Swal.fire({
            title: "Promo",
            text: "Invalid Promo Code",
            icon: "error",
          });
        } else {
          setAppliedPromoCode(res.data.promoCodeText);
          setPromoCodeDiscount(res.data.discount);
        }
      });
  };

  const placeOrder = () => {
    if (!auth.isAuthenticated) {
      Swal.fire({
        title: "Orders",
        text: "Please login to place order",
        icon: "error",
      }).then(function () {
        navigate({
          pathname: "/login",
          search: "?returnUrl=shoppingcart",
        });
      });
    } else {
      dispatch(setLoading());
      let orderItems: any = [];
      shoppingCart.shoppingCart.forEach((element) => {
        let orderItem = {
          ProductId: element.productId,
          Quantity: element.quantity,
        };
        orderItems.push(orderItem);
      });
      orderApi()
        .create(orderItems, appliedPromoCode)
        .then((res) => {
          dispatch(clearCart());
          navigate("/orderplaced");
        })
        .catch((error) => {
          
        });
    }
  };

  const deleteItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));
  return (
    <>
      {!shoppingCart.shoppingCart ||
        (shoppingCart.shoppingCart.length === 0 && (
          <Box display="flex" justifyContent="center">
            <Typography variant="h5">
              You have no items in your shopping cart
            </Typography>
          </Box>
        ))}
      {!loading &&
        shoppingCart.shoppingCart &&
        shoppingCart.shoppingCart.length > 0 && (
          <>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{
                flexDirection: {
                  xs: "column",
                  md: "row",
                  lg: "row",
                  textAlign: "center",
                },
              }}
            >
              <Item sx={{ textAlign: "left", maxWidth: "843px" }}>
                <Typography variant="h5" sx={{ pb: "10px" }}>
                  Your shopping cart items:
                </Typography>
                <table className="table shoppingCartTable">
                  <thead>
                    <tr>
                      <th className="shoppingCartTableHeaderItem">Product</th>
                      <th className="shoppingCartTableHeaderItem">
                        Description
                      </th>
                      <th className="shoppingCartTableHeaderItem">Price</th>
                      <th className="shoppingCartTableHeaderItem">Quantity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoppingCart.shoppingCart.length > 0 &&
                      shoppingCart.shoppingCart.map((item, i) => {
                        return (
                          <tr key={item.productId}>
                            <td className="shoppingCartProductImgTd">
                              <img
                                className="shoppingCartProductImg"
                                src={
                                  item?.imageName
                                    ? imagesUrl + "products/" + item.imageName
                                    : ""
                                }
                                alt={item.name}
                              />
                            </td>
                            <td className="shoppingCartDescription">
                              <span className="productNameText">
                                {item.name}
                              </span>
                              <br />
                              {item.description}
                            </td>
                            <td
                              style={{
                                paddingTop: "15px",
                                paddingRight: "15px",
                              }}
                            >
                              <h2>
                                <strong>{item.totalPrice}$</strong>
                              </h2>
                            </td>
                            <td style={{ paddingRight: "15px" }}>
                              <QuantityInput
                                className="cartQuantitySelector"
                                input={item.quantity}
                                productId={item.productId}
                                inputHandler={inputQuantityHandler}
                              />
                            </td>
                            <td>
                              <i
                                className="fa fa-trash cartDeleteItem"
                                aria-hidden="true"
                                onClick={() => {
                                  deleteItem(item.productId);
                                }}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Item>
              <Item
                sx={{
                  marginLeft: {
                    xs: "0px !important",
                  },
                }}
              >
                <Typography variant="h5" sx={{ pb: "10px" }}>
                  Order Summary:
                </Typography>
                <hr />
                <Box className="orderSummaryWrapper">
                  {!appliedPromoCode && (
                    <>
                      <Box sx={{ textAlign: "center" }}>
                        <FormLabel component="legend" sx={{ color: "black" }}>
                          Do you have promo code?
                        </FormLabel>
                      </Box>
                    </>
                  )}

                  <Box
                    className="input-group promoCodeApplyWrapper"
                    display={appliedPromoCode ? "none" : ""}
                    sx={{ textAlign: "center" }}
                  >
                    <TextField
                      placeholder="Promo Code"
                      variant="outlined"
                      size="small"
                      onChange={(e) => {
                        promoCode.current = e.target.value;
                      }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        backgroundColor: "white",
                      }}
                    />
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "white",
                        height: "40px",
                        display: appliedPromoCode ? "none" : "inline",
                      }}
                      onClick={() => {
                        handleApplyPromoCode();
                      }}
                    >
                      Apply
                    </Button>
                  </Box>

                  {appliedPromoCode && (
                    <Box style={{ textAlign: "center" }}>
                      <FormLabel
                        component="legend"
                        sx={{ color: "green", fontWeight: "bold" }}
                      >
                        Promo Code Applied
                      </FormLabel>
                    </Box>
                  )}
                  <Box
                    component="span"
                    className="orderSubtotalText"
                    sx={{ color: "black" }}
                  >
                    Shipping:
                  </Box>
                  <Box
                    component="span"
                    className="orderSubtotalText"
                    sx={{ color: "black", float: "right" }}
                  >
                    $0
                  </Box>
                  <br />
                  <Box
                    component="span"
                    className="orderSubtotalText"
                    sx={{ color: "black" }}
                  >
                    Subtotal:
                  </Box>
                  <Box
                    component="span"
                    className="orderSubtotalText"
                    sx={{ color: "black", float: "right" }}
                  >
                    {!appliedPromoCode && (
                      <Box component="span">
                        $
                        {shoppingCart.shoppingCart.reduce(
                          (total, item) => item.totalPrice + total,
                          0
                        )}
                      </Box>
                    )}
                    {appliedPromoCode && (
                      <Box component="span">
                        <s>
                          $
                          {shoppingCart.shoppingCart.reduce(
                            (total, item) => item.totalPrice + total,
                            0
                          )}
                        </s>
                      </Box>
                    )}
                  </Box>
                  {appliedPromoCode && (
                    <>
                      <br />
                      <Box
                        component="span"
                        className="orderSubtotalText"
                        sx={{ color: "black" }}
                      >
                        Subtotal with promo:
                      </Box>
                      <Box
                        component="span"
                        sx={{ color: "black", float: "right" }}
                        className="orderSubtotalText"
                      >
                        ${getSubTotalWithPromoCode()}
                      </Box>
                    </>
                  )}
                  <br />
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: "5px", mb: "5px", width: "200px" }}
                      onClick={() => placeOrder()}
                    >
                      Place Order
                    </Button>
                  </Box>
                </Box>
              </Item>
            </Stack>
          </>
        )}
      <LoaderOverlay loading={loading} />
    </>
  );
}

export default ShoppingCart;
