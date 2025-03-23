import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { categoryApi, productApi } from "../../api/apiAndInterceptor";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "../../Admin.module.css";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { useParams } from "react-router-dom";

const AdminAddEditProduct = () => {
  const [productId, setProductId] = useState<number>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameInputFocusedFirstTime, setNameInputFocusedFirstTime] =
    useState(false);
  const [price, setPrice] = useState("");

  const [
    descriptionInputFocusedFirstTime,
    setDescriptionInputFocusedFirstTime,
  ] = useState(false);
  const [priceInputFocusedFirstTime, setPriceInputFocusedFirstTime] =
    useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<Category[]>();
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
      setProductId(Number(id));
      productApi()
        .getById(id)
        .then((res) => {
          setLoading(false);
          setName(res.data.name);
          setCategoryId(res.data.categoryId);
          setDescription(res.data.description);
          setPrice(res.data.price);
          setImageName(res.data.imageName);
        });
    }
    setLoading(true);
    categoryApi()
      .getAll()
      .then((res: any) => {
        setLoading(false);
        setCategoryList(res.data.categoryList);
        if (!id && res.data.categoryList && res.data.categoryList.length > 0) {
          setCategoryId(res.data.categoryList[0].id);
        }
      });
  }, []);

  const handleChangeCategory = (event: any) => {
    setCategoryId(event.target.value);
  };

  const setAddEditProductImageFile = (event: any) => {
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

  const handleAddEditProduct = () => {
    if (!name || !description || !categoryId || !price) {
      Swal.fire({
        title: "Error",
        text: "Please fill all the fields",
        icon: "error",
      });
      return;
    } else if (!imageFile && !productId) {
      Swal.fire({
        title: "Error",
        text: "Please upload image",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id", productId?.toString() ?? "0");
    formData.append("name", name);
    formData.append("categoryId", categoryId?.toString());
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) {
      formData.set("imageFile", imageFile);
    }

    if (!productId) {
      setLoading(true);
      productApi()
        .create(formData)
        .then((res) => {
          redirectToAdminProducts();
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      productApi()
        .update(formData)
        .then((res) => {
          redirectToAdminProducts();
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const redirectToAdminProducts = () => {
    navigate({
      pathname: "/admin",
      search: "?tabIndex=1",
    });
  };

  return (
    <>
      <Typography variant="h6">
        {!productId ? "Add" : "Edit"} product:
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
      <Box>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          id="category"
          size="small"
          sx={{ width: "223px" }}
          labelId="category-label"
          value={categoryId}
          onChange={handleChangeCategory}
        >
          {categoryList &&
            categoryList.length > 0 &&
            categoryList.map((category: Category, i: number) => {
              return (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              );
            })}
        </Select>
      </Box>
      <Box>
        <TextField
          id="description"
          size="small"
          margin="normal"
          required
          multiline
          type="text"
          label="Description"
          value={description}
          rows={3}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onFocus={() => {
            setDescriptionInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  descriptionInputFocusedFirstTime && description.length === 0
                    ? "red"
                    : "inherit",
              },
            },
            width: "223px",
          }}
        />
      </Box>
      <Box>
        <TextField
          id="price"
          size="small"
          margin="normal"
          required
          type="number"
          label="Price $"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          onFocus={() => {
            setPriceInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  priceInputFocusedFirstTime && !price ? "red" : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box>
        <label
          htmlFor="imageUploadAddEditProduct"
          className={`${styles.customFileUpload}`}
        >
          <i className="fa fa-cloud-upload"></i> Upload Image
        </label>
        <input
          accept="image/png, image/gif, image/jpeg"
          id="imageUploadAddEditProduct"
          type="file"
          className={`${styles.fileUploadHide}`}
          onChange={(e) => setAddEditProductImageFile(e)}
        />
      </Box>
      <img
        style={{ display: imagePreviewSrc || imageName ? "" : "none" }}
        className={`${styles.addProductShowImg}`}
        src={
          imagePreviewSrc
            ? "data:image/jpeg;base64," + imagePreviewSrc
            : imageName
            ? imagesUrl + "products/" + imageName
            : ""
        }
        alt="productImage"
      />
      <Box sx={{ marginTop: "15px" }}>
        <Button
          sx={{ marginRight: "55px" }}
          variant="contained"
          color="error"
          onClick={() => {
            redirectToAdminProducts();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => handleAddEditProduct()}
        >
          {productId !== 0 && productId ? "Save" : "Add"}
        </Button>
      </Box>
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminAddEditProduct;
