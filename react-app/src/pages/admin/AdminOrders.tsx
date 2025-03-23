import { useEffect, useState } from "react";
import moment from "moment";
import { OrderItem } from "../../models/orderItem";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/apiAndInterceptor";
import { Button, Pagination } from "@mui/material";
import React from "react";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {   
    getOrders();
  }, []);

  function getOrders(pageIndex?: number) {
    let pageSize = 8;
    setLoading(true);
    orderApi()
      .getAll(pageIndex ?? 1, pageSize)
      .then((res) => {
        setLoading(false);
        setOrders(res.data);       
      });
  }

  function onPageChange(event: any, page: number) {
    getOrders(page);
  }

  function shipOrder(id: number) {
    orderApi()
      .ship(id)
      .then(() => {
        getOrders();
      });
  }

  const getOrderItems = (orderItems: OrderItem[], orderId: any) => {
    let trs: any = [];
    orderItems.forEach((element) => {
      trs.push(
        <tr key={`orderItemId_${element.id}_orderId_${orderId}`}>
          <td
            onClick={() => navigate("/details/" + element.productId)}
            style={{ textAlign: "center" }}
          >
            <img
              className="orderItemProductImg"
              src={imagesUrl + "products/" + element?.product?.imageName}
              alt={element.productId?.toString()}
              style={{ cursor: "pointer" }}
            />
          </td>
          <td
            onClick={() => navigate("/details/" + element.id)}
            style={{ cursor: "pointer" }}
            className="ordersTableUserDescription"
          >
            <span className="productNameText">{element?.product?.name}</span>
            <br />
            {element?.product?.description}
          </td>
          <td className="ordersTableUserDescription">
            <h4>{element?.product?.price}$</h4>
          </td>
          <td className="ordersTableUserDescription">
            <h3>{element.quantity}</h3>
          </td>
        </tr>
      );
    });

    return (
      <>
        <tr key={"tr1_orderItems_orderId_" + orderId}>
          <td style={{ border: "0", paddingBottom: "0px" }}>
            <h4 style={{ padding: "0px", margin: "0px" }}>
              #{orderId} Order Items
            </h4>
          </td>
        </tr>
        <tr key={"orderItemsThTr_orderId_" + orderId}>
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
    <>
      {!loading && orders && orders.orderList.length > 0 && (
        <table className="table ordersTable">
          <thead>
            <tr
              key="ordersTableMainHeaderTr"
              data-key={"ordersTableMainHeaderTr"}
            >
              <th className="ordersTableUserThs">Order #</th>
              <th className="ordersTableUserThs">Date</th>
              <th className="ordersTableUserThs">Is Shipped</th>
              <th className="ordersTableUserThs">Promo Code Used</th>
              <th className="ordersTableUserThs">Subtotal</th>
              <th className="ordersTableUserThs" style={{ width: "177px" }}>
                Subtotal with promo
              </th>
              <th className="ordersTableUserThs">User</th>
            </tr>
          </thead>
          <tbody>
            {orders.orderList.map((item: any, i: number) => {
              return (
                <React.Fragment key={`ReactFR_${item.id}`}>
                  <tr key={"orderId_" + item.id + "_index_" + i}>
                    <td className="ordersTableUserTds">#{item.id}</td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      {moment(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      {item.isShipped ? (
                        "Order is shipped"
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => shipOrder(item.id)}
                        >
                          Ship Order
                        </Button>
                      )}
                    </td>
                    <td
                      className="ordersTableUserTds"
                      style={{ textAlign: "center" }}
                    >
                      {item.promoCodeId == null
                        ? "Not Used"
                        : item.promoCode?.promoCodeText}
                    </td>
                    <td className="ordersTableUserTds tdsCenter">
                      ${item.subtotal}
                    </td>
                    <td className="ordersTableUserTds tdsCenter">
                      {item.subtotalWithPromo != null
                        ? "$" + item.subtotalWithPromo
                        : ""}
                    </td>
                    <td className="ordersTableUserTds">{item.userEmail}</td>
                  </tr>
                  {getOrderItems(item.orderItems, item.id)}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="productsPagination">
        {!loading && orders?.pager && (
          <span style={{ fontStyle: "italic" }}>
            {orders?.pager?.paginationSummary}
          </span>
        )}
        {!loading && orders?.pager && (
          <div className="" style={{ float: "right" }}>
            <Pagination
              count={orders.pager.totalPages}
              showFirstButton
              showLastButton
              page={orders.pager.currentPage}
              onChange={(e, page) => onPageChange(e, page)}
            />
          </div>
        )}
      </div>
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminOrders;
