import { Box, TextField } from "@mui/material";
import React from "react";

const BecomeSellerStep1 = ({ formik }) => {
  return (
    <Box>
      <div>
        <p className="text-xl font-bold text-center pb-9">Contact Details</p>
        <div className="space-y-9">
          <TextField
            fullWidth
            id="mobile"
            name="mobile"
            label="mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.error.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </div>
      </div>
    </Box>
  );
};

export default BecomeSellerStep1;
