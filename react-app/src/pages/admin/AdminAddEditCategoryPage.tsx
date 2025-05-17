import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/apiAndInterceptor";
import { Box, TextField, Button, FormControlLabel, Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import styles from "../../Admin.module.css";
import { Category } from "../../models/category";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { useParams } from "react-router-dom";

const AdminAddEditCategory = () => {
  const [name, setName] = useState("");
  const [nameInputFocusedFirstTime, setNameInputFocusedFirstTime] =
    useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [imageName, setImageName] = useState<string>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>();
  const [imageFile, setImageFile] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const imagesUrl = process.env.REACT_APP_IMAGES_URL;

  useEffect(() => {
    let id = params?.id;
    if (id) {
      setLoading(true);
      setCategoryId(Number(id));
      categoryApi()
        .getById(Number(id))
        .then((res) => {
          setLoading(false);
          setName(res.data.name);
          setImageName(res.data.imageName);
        });
    }
  }, []);

  const setAddEditCategoryImageFile = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        let base64Str = reader.result as string;
        base64Str = base64Str
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/gif;base64,", "");
        setImagePreviewSrc(base64Str);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const redirectToAdminCategories = () => {
    navigate({
      pathname: "/admin",
      search: "?tabIndex=2",
    });
  };

  const handleAddEditCategory = () => {
    if (!name) {
      Swal.fire({
        title: "Error",
        text: "Please enter category name",
        icon: "error",
      });
      return;
    } else if (!imageFile && !imageName) {
      Swal.fire({
        title: "Error",
        text: "Please upload image",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id", categoryId?.toString() ?? "0");
    formData.append("name", name);
    formData.append("imageName", imageName!?.toString());
    if (imageFile) {
      formData.set("imageFile", imageFile);
    }

    if (!categoryId) {
      setLoading(true);
      categoryApi()
        .create(formData)
        .then((res) => {
          redirectToAdminCategories();
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      categoryApi()
        .update(formData)
        .then((res) => {
          redirectToAdminCategories();
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Typography variant="h6">
        {!categoryId ? "Add" : "Edit"} category:
      </Typography>
      <Box>
        <TextField
          id="name"
          size="small"
          margin="normal"
          required
          type="text"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onFocus={() => {
            setNameInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  nameInputFocusedFirstTime && name.length === 0
                    ? "red"
                    : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ display: "block" }}>
        <label
          htmlFor="imageUploadAddEditProduct"
          className={`${styles.customFileUpload}`}
        >
          <i className="fa fa-cloud-upload"></i> Upload category image
        </label>
        <input
          accept="image/png, image/gif, image/jpeg"
          id="imageUploadAddEditProduct"
          type="file"
          className={`${styles.fileUploadHide}`}
          onChange={(e) => setAddEditCategoryImageFile(e)}
        />
      </Box>
       <Box sx={{ display: "block" }}>
        <img
          style={{ display: imagePreviewSrc || imageName ? "" : "none" }}
          className={`${styles.addProductShowImg}`}
          src={
            imagePreviewSrc
              ? "data:image/jpeg;base64," + imagePreviewSrc
              : imageName
              ? imagesUrl + "categories/" + imageName
              : ""
          }
          alt="productImage"
        />
      </Box>
      <Box sx={{ marginTop: "15px" }}>
        <Button
          sx={{ marginRight: "55px" }}
          variant="contained"
          color="error"
          onClick={() => {
            redirectToAdminCategories();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => handleAddEditCategory()}
        >
          {categoryId !== 0 && categoryId ? "Save" : "Add"}
        </Button>
      </Box>
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminAddEditCategory;
