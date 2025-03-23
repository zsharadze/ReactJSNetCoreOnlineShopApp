import { useEffect, useState } from "react";
import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import styles from "../../Admin.module.css";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { promoCodeApi } from "../../api/apiAndInterceptor";
import { PromoCode } from "../../models/promoCode";
import { useNavigate } from "react-router-dom";
import MoneyIcon from "@mui/icons-material/Money";
import QuantityInput from "../../shared/componenets/QuantityInput";
import moment from "moment";

const AdminPromoCodes = () => {
  const [loading, setLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<any>();
  const navigate = useNavigate();
  //   const navigate = useNavigate();
  const [inputPromoCodeQuantity, setInputPromoCodeQuantity] = useState(1);
  const [inputPromoCodeDiscount, setInputPromoCodeDiscount] = useState(50);
  const pageSize = 12;

  useEffect(() => {
    getPromoCodes();
  }, []);

  function getPromoCodes(pageIndex?: number) {
    setLoading(true);
    promoCodeApi()
      .getAll(pageIndex ?? 1, pageSize)
      .then((res) => {
        setLoading(false);
        setPromoCodes(res.data);
      });
  }

  function onPageChange(event: any, page: number) {
    getPromoCodes(page);
  }

  const inputPromoCodeQuantityHandler = (
    event: any,
    value: number,
    id: number
  ) => {
    setInputPromoCodeQuantity(value);
  };

  const inputPromoCodeDiscountHandler = (
    event: any,
    value: number,
    id: number
  ) => {
    setInputPromoCodeDiscount(value);
  };

  const generatePromoCodes = () => {
    promoCodeApi()
      .generate(inputPromoCodeQuantity, inputPromoCodeDiscount)
      .then((res) => {
        getPromoCodes(1);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Grid container direction="row" justifyContent="left" alignItems="center">
        <Button
          variant="contained"
          sx={{ display: "", marginRight: "15px" }}
          endIcon={<MoneyIcon />}
          onClick={() => {
            generatePromoCodes();
          }}
        >
          Generate New Promo Codes
        </Button>
        <Typography
          sx={{
            display: "inline-block",
            fontSize: "16px",
            marginRight: "15px",
          }}
        >
          Quantity:
        </Typography>
        <Box sx={{ display: "inline-block", marginRight: "15px" }}>
          <QuantityInput
            input={inputPromoCodeQuantity}
            inputHandler={inputPromoCodeQuantityHandler}
          />
        </Box>
        <Typography
          sx={{
            display: "inline-block",
            fontSize: "16px",
            marginRight: "15px",
          }}
        >
          Discount $:
        </Typography>
        <Box sx={{ display: "inline-block" }}>
          <QuantityInput
            input={inputPromoCodeDiscount}
            inputHandler={inputPromoCodeDiscountHandler}
          />
        </Box>
      </Grid>
      <table className={`${styles.adminPromoCodesTable}`}>
        <thead>
          <tr>
            <th
              className={`${styles.adminPromoCodesTableThLeft} ${styles.adminPromoCodesTableTdPadding}`}
            >
              Promo Code
            </th>
            <th
              className={`${styles.adminPromoCodesTableThLeft} ${styles.adminPromoCodesTableTdPadding}`}
            >
              Discount
            </th>
            <th>Created Date</th>
            <th>Used By User</th>
            <th className={`${styles.adminPromoCodesTableThLeft}`}>
              Used in Order #
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            promoCodes &&
            promoCodes.promoCodeList.length > 0 &&
            promoCodes.promoCodeList.map((item: PromoCode, i: number) => {
              return (
                <tr key={item.id}>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminPromoCodesTableTdPadding}`}
                  >
                    {item.promoCodeText}
                  </td>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminPromoCodesTableTdPadding}`}
                  >
                    {item.discount}$
                  </td>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminPromoCodesTableTdPadding}`}
                  >
                    {moment(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminPromoCodesTableTdPadding}`}
                  >
                    {item.usedByUserEmail}
                  </td>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminPromoCodesTableTdPadding}`}
                  >
                    {item.usedOnOrderId}
                  </td>
                  <td className={`${styles.adminCategoriesTableTd}`}>
                    <i
                      title="Delete"
                      className={`fa fa-trash ${styles.deleteBtn}`}
                      onClick={() => {
                        Swal.fire({
                          title: "Delete",
                          text: "Are you sure to delete?",
                          icon: "warning",
                          showCancelButton: true,
                        }).then(function (res) {
                          if (res.isConfirmed) {
                            promoCodeApi()
                              .delete(Number(item.id))
                              .then((res: any) => {
                                navigate({
                                  pathname: "/admin",
                                  search: "?tabIndex=3",
                                });
                              })
                              .catch((error) => {});
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
        {!loading && promoCodes?.pager && (
          <span
            style={{
              fontStyle: "italic",
            }}
          >
            {promoCodes?.pager?.paginationSummary}
          </span>
        )}
      </div>
      {!loading && promoCodes?.pager && (
        <div className="" style={{ float: "left", marginTop: "10px" }}>
          <Pagination
            count={promoCodes.pager.totalPages}
            showFirstButton
            showLastButton
            page={promoCodes.pager.currentPage}
            onChange={(e, page) => onPageChange(e, page)}
          />
        </div>
      )}
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminPromoCodes;
