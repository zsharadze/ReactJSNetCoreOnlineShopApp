import { Box, Pagination } from "@mui/material";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Order } from "../../models/order";
import { OrderItem } from "../../models/orderItem";
import { useNavigate } from "react-router-dom";
import { getOrdersForCurrentUserAsync } from "../../redux/orderSlice";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import moment from "moment";

function MyOrders() {
  const orders = useSelector((state: RootState) => state.orders);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {
    dispatch(getOrdersForCurrentUserAsync());
  }, []);

  function onPageChange(event: any, page: number) {
    dispatch(getOrdersForCurrentUserAsync(page));
  }

  const getOrderItems = (orderItems: OrderItem[], orderId: number) => {
    let trs: any = [];
    orderItems.forEach((element) => {
      trs.push(
        <tr key={element.id}>
          <td
            onClick={() => navigate("/details/" + element.productId)}
            style={{ textAlign: "center" }}
          >
            <img
              className="orderItemProductImg"
              src={imagesUrl + "products/" + element.product?.imageName}
              alt={element.productId?.toString()}
              style={{ cursor: "pointer" }}
            />
          </td>
          <td
            onClick={() => navigate("/details/" + element.productId)}
            style={{ cursor: "pointer" }}
            className="ordersTableUserDescription"
          >
            <span className="productNameText">{element.product?.name}</span>
            <br />
            {element.product?.description}
          </td>
          <td className="ordersTableUserPrice" style={{ textAlign: "center" }}>
            <h4>{element.product?.price}$</h4>
          </td>
          <td
            className="ordersTableUserDescription"
            style={{ textAlign: "center" }}
          >
            <h3>{element.quantity}</h3>
          </td>
        </tr>
      );
    });

    return (
      <>
        <tr>
          <td style={{ border: "0", paddingBottom: "0px" }}>
            <h4 style={{ padding: "0px", margin: "0px" }}>
              #{orderId} Order Items
            </h4>
          </td>
        </tr>
        <tr>
          <td colSpan={4} style={{ paddingTop: "0px" }}>
            <table className="table orderItemTable">
              <thead>
                <tr>
                  <th></th>
                  <th className="ordersTableUserThs">Description</th>
                  <th className="ordersTableUserThs">Price</th>
                  <th className="ordersTableUserThs">Qauntity</th>
                </tr>
              </thead>
              <tbody>{trs}</tbody>
            </table>
          </td>
        </tr>
      </>
    );
  };

  return (
    <Box>
      <Box>
        <h3 style={{ textAlign: "center" }}>My Orders</h3>
        {!loading &&
          orders?.orders?.orderList?.map((item: Order, i: number) => {
            return (
              <table key={item.id} className="table ordersTableUser">
                <thead>
                  <tr>
                    <th className="ordersTableUserThs">Order #</th>
                    <th className="ordersTableUserThs">Date</th>
                    <th className="ordersTableUserThs"> Is Shipped</th>
                    <th className="ordersTableUserThs">Promo Code Used</th>
                    <th className="ordersTableUserThs">Subtotal</th>
                    <th
                      className="ordersTableUserThs"
                      style={{ width: "177px" }}
                    >
                      Subtotal with promo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ordersTableUserTds">#{item.id}</td>
                    <td className="ordersTableUserTds">
                      {moment(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td
                      className={
                        item.isShipped
                          ? "ordersTableUserTds bg-shipped"
                          : "ordersTableUserTds bg-not-shipped"
                      }
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.isShipped ? "Yes" : "No"}
                    </td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      {item.promoCodeId == null
                        ? "Not Used"
                        : item.promoCode?.promoCodeText}
                    </td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      ${item.subtotal}
                    </td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      {item.subtotalWithPromo != null
                        ? "$" + item.subtotalWithPromo
                        : ""}
                    </td>
                  </tr>
                  {getOrderItems(item.orderItems!, item.id!)}
                </tbody>
              </table>
            );
          })}
        <Box className="ordersPagination"></Box>
        {orders?.orders?.orderList &&
          orders?.orders?.orderList.length === 0 && (
            <h4>You don't have orders</h4>
          )}
      </Box>
      <div className="productsPagination">
        {!loading &&
          orders?.orders?.pager &&
          orders?.orders?.orderList?.length > 0 && (
            <span style={{ fontStyle: "italic" }}>
              {orders?.orders?.pager?.paginationSummary}
            </span>
          )}
        {!loading &&
          orders?.orders?.pager &&
          orders?.orders?.orderList?.length > 0 && (
            <div className="" style={{ float: "right" }}>
              <Pagination
                count={orders.orders.pager.totalPages}
                showFirstButton
                showLastButton
                page={orders.orders.pager.currentPage}
                onChange={(e, page) => onPageChange(e, page)}
              />
            </div>
          )}
      </div>
      <LoaderOverlay loading={loading} />
    </Box>
  );
}
export default MyOrders;
