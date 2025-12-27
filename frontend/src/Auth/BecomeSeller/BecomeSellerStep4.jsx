import { TextField } from "@mui/material";
import React from "react";

const BecomeSellerStep4 = ({formik}) => {
  return (
    <div className="space-y-5">
      <div>
        <TextField
          fullWidth
          name="businessDetails.businessName"
          label="Business Name"
          value={formik.values.businessDetails.businessName}
          onChange={formik.handleChange}
          error={
            formik.touched?.businessDetails?.businessName &&
            Boolean(formik.errors?.businessDetails?.businessName)
          }
          helperText={
            formik.touched?.businessDetails?.businessName &&
            formik.errors?.businessDetails?.businessName
          }
        />
      </div>

      <div>
        <TextField
          fullWidth
          name="sellerName"
          label="Seller Name"
          value={formik.values.sellerName}
          onChange={formik.handleChange}
          error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
          helperText={formik.touched.sellerName && formik.errors.sellerName}
        />
      </div>

      <div>
        <TextField
          fullWidth
          name="email"
          label="E-mail"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </div>

      <div>
        <TextField
          fullWidth
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched?.password && Boolean(formik.errors?.password)}
          helperText={formik.touched?.password && formik.errors?.password}
        />
      </div>
    </div>
  );
};

export default BecomeSellerStep4;
