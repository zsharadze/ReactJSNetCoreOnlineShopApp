import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getProductsAsync } from "../../redux/productsSlice";
import { Product } from "../../models/product";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { Typography } from "@mui/material";

function ProductList() {
  const products = useSelector((state: RootState) => state.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const dispatch = useDispatch<any>();
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  function onPageChange(event: any, page: number) {
    dispatch(getProductsAsync(undefined, page));
  }

  return (
    <>
      <div id="product-list">
        {!loading &&
          products?.products?.productList?.map((item: Product, i: number) => {
            return (
              <Link
                key={item.id}
                to={"details/" + item.id}
                className="noLinkStyle"
              >
                <div className="product">
                  <div className="productItemImage">
                    <img
                      src={imagesUrl + "products/" + item.imageName}
                      alt={item.name}
                    />
                  </div>
                  <span className="productNameText">{item.name}</span>
                  <span className="productDescriptionText">
                    {item.description}
                  </span>
                  <div style={{ verticalAlign: "bottom", marginTop: "auto" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "green",
                      }}
                    >
                      {item.price}$
                    </Typography>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="productsPagination">
        {!loading && products?.products?.pager && (
          <span style={{ fontStyle: "italic" }}>
            {products?.products?.pager?.paginationSummary}
          </span>
        )}
        {!loading && products?.products?.pager && (
          <div className="" style={{ float: "right" }}>
            <Pagination
              count={products.products.pager.totalPages}
              showFirstButton
              showLastButton
              page={products.products.pager.currentPage}
              onChange={(e, page) => onPageChange(e, page)}
            />
          </div>
        )}
      </div>
      <LoaderOverlay loading={loading} />
    </>
  );
}

export default ProductList;
