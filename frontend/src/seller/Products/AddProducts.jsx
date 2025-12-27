import React, { useState } from "react";
import { useFormik } from "formik";
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
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
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
import { useAppDispatch } from "../../Redux Toolkit/store";
import { createProduct } from "../../Redux Toolkit/features/seller/sellerProductSlice";

const ageGroups = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "13+ Years", "All Ages"];
const materials = ["Plastic", "Wood", "Metal", "Fabric", "Foam", "Rubber", "Electronic", "Mixed Materials"];
const safetyCerts = ["CE Certified", "ASTM F963", "EN71", "CPSC Approved", "BIS Certified", "None"];

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

const AddProducts = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: 1,
      color: "Multicolor",
      images: [],
      category: "",
      category2: "",
      category3: "",
      ageGroup: "All Ages",
      material: "Plastic",
      safetyCertification: "CE Certified",
      batteryRequired: false,
      brand: "",
    },
    onSubmit: (values) => {
      const jwt = localStorage.getItem("jwt");
      dispatch(createProduct({ jwt, request: values }));
    },
  });

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
    return category?.filter((child) => child.parentCategoryId === parentCategoryId);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center py-5">🧸 ADD NEW TOY</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>

          {/* Image upload */}
          <Grid size={{ xs: 12 }}>
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
                  <img src={item} alt="" className="w-24 h-24 object-cover rounded" />
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
            <TextField fullWidth id="title" name="title" label="Toy Name" value={formik.values.title} onChange={formik.handleChange} required />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth id="description" name="description" label="Description" multiline rows={3} value={formik.values.description} onChange={formik.handleChange} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField fullWidth id="brand" name="brand" label="Brand" value={formik.values.brand} onChange={formik.handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField fullWidth id="mrpPrice" name="mrpPrice" label="MRP Price (NRs)" type="number" value={formik.values.mrpPrice} onChange={formik.handleChange} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField fullWidth id="sellingPrice" name="sellingPrice" label="Selling Price (NRs)" type="number" value={formik.values.sellingPrice} onChange={formik.handleChange} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField fullWidth id="quantity" name="quantity" label="Stock Quantity" type="number" value={formik.values.quantity} onChange={formik.handleChange} required />
          </Grid>

          {/* Toy-specific attributes */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Age Group</InputLabel>
              <Select name="ageGroup" value={formik.values.ageGroup} onChange={formik.handleChange} label="Age Group">
                {ageGroups.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select name="material" value={formik.values.material} onChange={formik.handleChange} label="Material">
                {materials.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Safety Certification</InputLabel>
              <Select name="safetyCertification" value={formik.values.safetyCertification} onChange={formik.handleChange} label="Safety Certification">
                {safetyCerts.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
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

          {/* Category selectors */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Main Category</InputLabel>
              <Select name="category" value={formik.values.category} onChange={formik.handleChange} label="Main Category">
                <MenuItem value="">Select category</MenuItem>
                {mainCategory.map((item) => (
                  <MenuItem key={item.categoryid} value={item.categoryid}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Sub Category</InputLabel>
              <Select name="category2" value={formik.values.category2} onChange={formik.handleChange} label="Sub Category">
                <MenuItem value="">Select sub-category</MenuItem>
                {formik.values.category &&
                  categoryTwo[formik.values.category]?.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>{item.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Specific Type</InputLabel>
              <Select name="category3" value={formik.values.category3} onChange={formik.handleChange} label="Specific Type">
                <MenuItem value="">Select type</MenuItem>
                {formik.values.category2 &&
                  childCategory(categoryThree[formik.values.category], formik.values.category2)?.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>{item.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              sx={{ p: "14px", backgroundColor: "#e85d04" }}
              fullWidth
              type="submit"
              variant="contained"
            >
              🧸 Add Toy Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddProducts;
