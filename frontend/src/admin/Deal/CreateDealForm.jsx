import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { createDeal } from "../../Redux Toolkit/features/Admin/DealSlice";

const CreateDealForm = () => {
  const dispatch = useAppDispatch();
  const dealCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories.DEAL_CATEGORIES || [],
  );

  const formik = useFormik({
    initialValues: { discount: 0, category: "" },
    onSubmit: (values) => {
      dispatch(createDeal(values));
      formik.resetForm();
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", padding: 3 }}
      className="space-y-6"
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Create New Deal
      </Typography>

      <TextField
        fullWidth
        name="discount"
        label="Discount %"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
      />

      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          label="Category"
        >
          {dealCategories.map((item, index) => (
            <MenuItem key={index} value={item.categoryId}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button sx={{ py: "11px" }} fullWidth type="submit" variant="contained">
        Create Deal
      </Button>
    </Box>
  );
};

export default CreateDealForm;
