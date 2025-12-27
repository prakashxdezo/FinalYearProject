import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { mainCategory } from "../../data/Category/mainCategory";
import { actionFiguresLevelTwo } from "../../data/Category/level two/actionFiguresLevelTwo";
import { educationalToysLevelTwo } from "../../data/Category/level two/educationalToysLevelTwo";
import { boardGamesLevelTwo } from "../../data/Category/level two/boardGamesLevelTwo";
import { outdoorToysLevelTwo } from "../../data/Category/level two/outdoorToysLevelTwo";
import { actionFiguresLevelThree } from "../../data/Category/level three/actionFiguresLevelThree";
import { educationalToysLevelThree } from "../../data/Category/level three/educationalToysLevelThree";
import { boardGamesLevelThree } from "../../data/Category/level three/boardGamesLevelThree";
import { outdoorToysLevelThree } from "../../data/Category/level three/outdoorToysLevelThree";
import { uploadToCloudnary } from "../../util/uploadToCloudnary";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  updateProduct,
  fetchSellerProduct,
  clearUpdateSuccess,
} from "../../Redux Toolkit/features/seller/sellerProductSlice";

const ageGroups = [
  "0-2 Years",
  "3-5 Years",
  "6-8 Years",
  "9-12 Years",
  "13+ Years",
  "All Ages",
];
const materials = [
  "Plastic",
  "Wood",
  "Metal",
  "Fabric",
  "Foam",
  "Rubber",
  "Electronic",
  "Mixed Materials",
];
const safetyCerts = [
  "CE Certified",
  "ASTM F963",
  "EN71",
  "CPSC Approved",
  "BIS Certified",
  "None",
];

const categoryTwo = {
  "action-figures": actionFiguresLevelTwo,
  "educational-toys": educationalToysLevelTwo,
  "board-games": boardGamesLevelTwo,
  "outdoor-toys": outdoorToysLevelTwo,
};

const categoryThree = {
  "action-figures": actionFiguresLevelThree,
  "educational-toys": educationalToysLevelThree,
  "board-games": boardGamesLevelThree,
  "outdoor-toys": outdoorToysLevelThree,
};

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [uploadImage, setUploadImage] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [outOfStock, setOutOfStock] = useState(false);

  const { products, loading, updateSuccess } = useAppSelector(
    (store) => store.sellerProduct,
  );

  // Find product from Redux store
  const existingProduct = products.find((p) => p._id === productId);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: existingProduct?.title || "",
      description: existingProduct?.description || "",
      mrpPrice: existingProduct?.mrpPrice || "",
      sellingPrice: existingProduct?.sellingPrice || "",
      quantity: existingProduct?.quantity ?? 1,
      color: existingProduct?.color || "Multicolor",
      images: existingProduct?.images || [],
      ageGroup: existingProduct?.ageGroup || "All Ages",
      material: existingProduct?.material || "Plastic",
      safetyCertification:
        existingProduct?.safetyCertification || "CE Certified",
      batteryRequired: existingProduct?.batteryRequired || false,
      brand: existingProduct?.brand || "",
    },
    onSubmit: async (values) => {
      const jwt = localStorage.getItem("jwt");

      // If out-of-stock toggle is ON, set quantity to 0
      const payload = {
        ...values,
        quantity: outOfStock ? 0 : Number(values.quantity),
        mrpPrice: Number(values.mrpPrice),
        sellingPrice: Number(values.sellingPrice),
      };

      try {
        await dispatch(
          updateProduct({ jwt, product: payload, productId }),
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: typeof err === "string" ? err : "Failed to update product",
          severity: "error",
        });
      }
    },
  });

  // Initialise outOfStock toggle based on current quantity
  useEffect(() => {
    if (existingProduct) {
      setOutOfStock(existingProduct.quantity === 0);
    }
  }, [existingProduct]);

  // If products not loaded yet, fetch them
  useEffect(() => {
    if (!existingProduct) {
      const jwt = localStorage.getItem("jwt");
      dispatch(fetchSellerProduct(jwt));
    }
  }, [productId]);

  // Navigate back after successful update
  useEffect(() => {
    if (updateSuccess) {
      dispatch(clearUpdateSuccess());
      setTimeout(() => navigate("/seller/products"), 1200);
    }
  }, [updateSuccess]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadImage(true);
    const image = await uploadToCloudnary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updated = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue("images", updated);
  };

  const childCategory = (category, parentCategoryId) => {
    return category?.filter(
      (child) => child.parentCategoryId === parentCategoryId,
    );
  };

  if (loading && !existingProduct) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircularProgress />
      </div>
    );
  }

  if (!existingProduct && !loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found.</p>
        <Button
          onClick={() => navigate("/seller/products")}
          startIcon={<ArrowBackIcon />}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 pb-5">
        <button
          onClick={() => navigate("/seller/products")}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowBackIcon style={{ fontSize: 18 }} /> Back
        </button>
        <h1 className="text-xl font-bold">\u270f\ufe0f Edit Product</h1>
        <Chip
          label={existingProduct?.quantity === 0 ? "Out of Stock" : "In Stock"}
          color={existingProduct?.quantity === 0 ? "error" : "success"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* \u2500\u2500 Stock Status Toggle \u2500\u2500 */}
          <Grid size={{ xs: 12 }}>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Stock Status</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Toggle to mark this product as out of stock. This will be
                  immediately reflected on the customer side.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Chip
                  label={outOfStock ? "Out of Stock" : "In Stock"}
                  color={outOfStock ? "error" : "success"}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Switch
                  checked={outOfStock}
                  onChange={(e) => {
                    setOutOfStock(e.target.checked);
                    if (!e.target.checked) {
                      // restore original quantity or at least 1
                      formik.setFieldValue(
                        "quantity",
                        existingProduct?.quantity > 0
                          ? existingProduct.quantity
                          : 1,
                      );
                    }
                  }}
                  color="error"
                />
              </div>
            </div>
          </Grid>

          {/* Image upload */}
          <Grid size={{ xs: 12 }}>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Product Images
            </p>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-3">
              <label htmlFor="fileInput" className="relative">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-dashed rounded-md border-orange-400 hover:border-orange-600">
                  <AddPhotoAlternateIcon className="text-orange-500" />
                </span>
                {uploadImage && (
                  <div className="absolute inset-0 w-24 h-24 flex justify-center items-center">
                    <CircularProgress size={25} color="warning" />
                  </div>
                )}
              </label>
              {formik.values.images.map((item, index) => (
                <div className="relative" key={index}>
                  <img
                    src={item}
                    alt=""
                    className="w-24 h-24 object-cover rounded border border-gray-200"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          {/* Basic fields */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Toy Name"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="brand"
              name="brand"
              label="Brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="mrpPrice"
              name="mrpPrice"
              label="MRP Price (NRs)"
              type="number"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price (NRs)"
              type="number"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Stock Quantity"
              type="number"
              value={outOfStock ? 0 : formik.values.quantity}
              onChange={formik.handleChange}
              disabled={outOfStock}
              required
              helperText={outOfStock ? "Set to 0 (Out of Stock)" : ""}
            />
          </Grid>

          {/* Toy-specific attributes */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Age Group</InputLabel>
              <Select
                name="ageGroup"
                value={formik.values.ageGroup}
                onChange={formik.handleChange}
                label="Age Group"
              >
                {ageGroups.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select
                name="material"
                value={formik.values.material}
                onChange={formik.handleChange}
                label="Material"
              >
                {materials.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Safety Certification</InputLabel>
              <Select
                name="safetyCertification"
                value={formik.values.safetyCertification}
                onChange={formik.handleChange}
                label="Safety Certification"
              >
                {safetyCerts.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }} className="flex items-center">
            <FormControlLabel
              control={
                <Switch
                  name="batteryRequired"
                  checked={formik.values.batteryRequired}
                  onChange={formik.handleChange}
                  color="warning"
                />
              }
              label="Battery Required"
            />
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Button
              sx={{ p: "14px", backgroundColor: "#e85d04" }}
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "\ud83d\udcbe Save Changes"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Success / Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditProduct;
