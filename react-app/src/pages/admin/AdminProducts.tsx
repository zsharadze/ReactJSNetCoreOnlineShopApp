import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../api/apiAndInterceptor";
import { Pagination } from "@mui/material";
import styles from "../../Admin.module.css";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";

const AdminProducts = () => {
  const [products, setProducts] = useState<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {
    getProducts();
  }, []);

  function getProducts(pageIndex?: number) {
    let pageSize = 10;
    setLoading(true);
    productApi()
      .getAll(undefined, pageIndex ?? 1, pageSize, undefined)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      });
  }

  function onPageChange(event: any, page: number) {
    getProducts(page);
  }

  const AddProductClick = () => {
    navigate("/admin/addproduct");
  };

  const EditProductClick = (id: number) => {
    navigate("/admin/addproduct/" + id);
  };

  return (
    <>
      <i
        title="Add Product"
        className={`fa fa-plus ${styles.adminAddBtn}`}
        aria-hidden="true"
        onClick={() => AddProductClick()}
      ></i>
      <table className="table" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Image</th>
            <th
              className={`${styles.adminProductsTableThLeft} ${styles.adminProductsTableTdPadding}`}
            >
              Category
            </th>
            <th
              className={`${styles.adminProductsTableThLeft} ${styles.adminProductsTableTdPadding}`}
            >
              Name
            </th>
            <th className={`${styles.adminProductsTableThLeft}`}>
              Description
            </th>
            <th>Price</th>
            <th className={`${styles.adminProductsTableTdPadding}`}>
              Created Date
            </th>
            <th>Used in orders</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            products &&
            products.productList.length > 0 &&
            products.productList.map((item: any, i: number) => {
              return (
                <tr key={item.id}>
                  <td
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    className={`${styles.adminProductsTableTd}`}
                  >
                    <img
                      className={`${styles.productImgAdmin}`}
                      src={imagesUrl + "products/" + item.imageName}
                      alt={item.name}
                    />
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdPadding}`}
                  >
                    {item.categoryName}
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdPadding}`}
                  >
                    {item.name}
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdPadding}`}
                  >
                    {item.description}
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdPadding} ${styles.adminProductsTableTdCenter}`}
                  >
                    {item.price}$
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdCenter}`}
                  >
                    {moment(item.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td
                    className={`${styles.adminProductsTableTd} ${styles.adminProductsTableTdCenter}`}
                  >
                    {item.ordersCount}
                  </td>
                  <td className={`${styles.adminProductsTableTd}`}>
                    <i
                      title="Edit"
                      className={`fa fa-edit ${styles.editBtn}`}
                      onClick={() => EditProductClick(item.id)}
                    ></i>
                    <i
                      title="Delete"
                      className={`fa fa-trash ${styles.deleteBtn}`}
                      onClick={() => {
                        Swal.fire({
                          title: "Delete",
                          text: "Are you sure to delete? This will delete all orders associated with this product.",
                          icon: "warning",
                          showCancelButton: true,
                        }).then(function (res) {
                          if (res.isConfirmed) {
                            setLoading(true);
                            productApi()
                              .delete(item.id)
                              .then((resDeleteProduct) => {
                                setLoading(false);
                                navigate({
                                  pathname: "/admin",
                                  search: "?tabIndex=1",
                                });
                              })
                              .catch((error) => {})
                              .finally(() => {
                                setLoading(false);
                              });
                          }
                        });
                      }}
                    ></i>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        {!loading && products?.pager && (
          <span
            style={{
              fontStyle: "italic",
            }}
          >
            {products?.pager?.paginationSummary}
          </span>
        )}
      </div>
      {!loading && products?.pager && (
        <div className="" style={{ float: "left", marginTop: "10px" }}>
          <Pagination
            count={products.pager.totalPages}
            showFirstButton
            showLastButton
            page={products.pager.currentPage}
            onChange={(e, page) => onPageChange(e, page)}
          />
        </div>
      )}
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminProducts;
