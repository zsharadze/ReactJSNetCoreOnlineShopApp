import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/api";
import { Pagination } from "@mui/material";
import styles from "../../Admin.module.css";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { Category } from "../../models/category";

const AdminCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any>();
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    getCategories();
  }, []);

  function getCategories(pageIndex?: number) {
    setLoading(true);
    categoryApi()
      .getAll(pageIndex ?? 1, pageSize)
      .then((res) => {       
        setLoading(false);
        setCategories(res.data);
      });
  }

  const AddCategoryClick = () => {
    navigate("/admin/addcategory");
  };

  const EditCategoryClick = (id: number) => {
    navigate("/admin/addcategory/" + id);
  };

  function onPageChange(event: any, page: number) {
    getCategories(page);
  }

  return (
    <>
      <i
        title="Add Category"
        className={`fa fa-plus ${styles.adminAddBtn}`}
        aria-hidden="true"
        onClick={() => AddCategoryClick()}
      ></i>
      <table
        className="table"
        style={{ borderCollapse: "collapse", width: "45%" }}
      >
        <thead>
          <tr>
            <th
              className={`${styles.adminCategoriesTableThLeft} ${styles.adminCategoriesTableTdPadding}`}
            >
              Name
            </th>
            <th
              className={`${styles.adminCategoriesTableThLeft} ${styles.adminCategoriesTableTdPadding}`}
            >
              Fa Class
            </th>
            <th className={`${styles.adminCategoriesTableThLeft}`}>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            categories &&
            categories.categoryList.length > 0 &&
            categories.categoryList.map((item: Category, i: number) => {
              return (
                <tr key={item.id}>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminCategoriesTableTdPadding}`}
                  >
                    {item.name}
                  </td>
                  <td
                    className={`${styles.adminCategoriesTableTd} ${styles.adminCategoriesTableTdPadding}`}
                  >
                    {item.faClass}&nbsp;<i className={item.faClass}></i>
                  </td>
                  <td
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    className={`${styles.adminCategoriesTableTd}`}
                  >
                    {item.imageSrc && (
                      <img
                        className={`${styles.categoryImgAdmin}`}
                        src={"data:image/jpeg;base64," + item.imageSrc}
                        alt={item.name}
                      />
                    )}
                  </td>
                  <td className={`${styles.adminCategoriesTableTd}`}>
                    <i
                      title="Edit"
                      className={`fa fa-edit ${styles.editBtn}`}
                      onClick={() => EditCategoryClick(Number(item.id))}
                    ></i>
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
                            categoryApi()
                              .delete(Number(item.id))
                              .then((resDeleteCategory) => {                               
                                if (!resDeleteCategory.data) {
                                  Swal.fire({
                                    title: "Delete",
                                    text: "Can't delete category because there are products attached to it.",
                                    icon: "error",
                                  });
                                } else {
                                  navigate({
                                    pathname: "/admin",
                                    search: "?tabIndex=2",
                                  });
                                }
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
        {!loading && categories?.pager && (
          <span
            style={{
              fontStyle: "italic",
            }}
          >
            {categories?.pager?.paginationSummary}
          </span>
        )}
      </div>
      {!loading && categories?.pager && (
        <div className="" style={{ float: "left", marginTop: "10px" }}>
          <Pagination
            count={categories.pager.totalPages}
            showFirstButton
            showLastButton
            page={categories.pager.currentPage}
            onChange={(e, page) => onPageChange(e, page)}
          />
        </div>
      )}
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminCategories;
