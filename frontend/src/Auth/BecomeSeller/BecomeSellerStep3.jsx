import { TextField } from '@mui/material'
import React from 'react'

const BecomeSellerStep3 = ({formik}) => {
  return (
    <div className="space-y-5">
      <TextField
        fullWidth
        name="bankDetails.accountNumber"
        label="Account Number"
        value={formik.values.bankDetails.accountNumber}
        onChange={formik.handleChange}
        error={
          formik.touched.bankDetails?.accountNumber &&
          Boolean(formik.errors.bankDetails)
        }
        helperText={
          formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber
        }
      />

      <TextField
        fullWidth
        name="bankDetails.accountHolderName"
        label="Account Holder Name"
        value={formik.values.bankDetails.accountHolderName}
        onChange={formik.handleChange}
        error={
          formik.touched.bankDetails?.accountHolderName &&
          Boolean(formik.errors.bankDetails)
        }
        helperText={
          formik.touched.bankDetails?.accountHolderName && formik.errors.bankDetails?.accountHolderName
        }
      />

    </div>
  );
}

export default BecomeSellerStep3
