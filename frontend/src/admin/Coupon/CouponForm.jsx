import React from "react";
import { useFormik } from "formik";
import { Box, Button, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { createCoupon } from "../../Redux Toolkit/features/Admin/CouponSlice";

const CouponForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      code: "",
      discountPercentage: "",
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: "",
    },

    onSubmit: (values) => {
      console.log(values);
      dispatch(
        createCoupon({ coupon: values, jwt: localStorage.getItem("jwt") }),
      );
    },
  });

  return (
    <div className="max-w-3xl">
      <Box sx={{ mt: 3 }} component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="code"
              label="Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              name="discountPercentage"
              label="Discount Percentage"
              value={formik.values.discountPercentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.discountPercentage &&
                Boolean(formik.errors.discountPercentage)
              }
              helperText={
                formik.touched.discountPercentage &&
                formik.errors.discountPercentage
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Validity Start Date"
                value={formik.values.validityStartDate}
                onChange={(value) =>
                  formik.setFieldValue("validityStartDate", value)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Validity End Date"
                value={formik.values.validityEndDate}
                onChange={(value) =>
                  formik.setFieldValue("validityEndDate", value)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              name="minimumOrderValue"
              label="Minimum Order Value"
              value={formik.values.minimumOrderValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.minimumOrderValue &&
                Boolean(formik.errors.minimumOrderValue)
              }
              helperText={
                formik.touched.minimumOrderValue &&
                formik.errors.minimumOrderValue
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              sx={{ py: "12px" }}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CouponForm;
