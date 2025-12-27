import {
  Button,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  sendLoginOtp,
  verifyLoginOtp,
  clearSellerAuthError,
} from "../../Redux Toolkit/features/seller/sellerAuthentication";
import { useNavigate } from "react-router";

const SellerLogin = () => {
  const { sellerAuth } = useAppSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(clearSellerAuthError());
  }, []);

  const formik = useFormik({
    initialValues: { email: "", otp: "" },
    onSubmit: (values) => {
      dispatch(verifyLoginOtp({ email: values.email, otp: values.otp })).then(
        (result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setSuccessMsg("Login successful! Redirecting to dashboard...");
            setTimeout(() => navigate("/seller/dashboard"), 2000);
          }
        },
      );
    },
  });

  const handleSentOtp = () => {
    if (!formik.values.email) {
      formik.setFieldError("email", "Email is required");
      return;
    }
    dispatch(sendLoginOtp({ email: formik.values.email }));
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-bold pb-5">Seller Login</h1>

      <div className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="E-mail"
          value={formik.values.email}
          onChange={(e) => {
            formik.handleChange(e);
            if (sellerAuth.error) dispatch(clearSellerAuthError());
          }}
          onBlur={formik.handleBlur}
          disabled={sellerAuth.otpSent || sellerAuth.loading}
        />

        {sellerAuth.otpSent && (
          <TextField
            fullWidth
            name="otp"
            label="OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={sellerAuth.loading}
          />
        )}

        {sellerAuth.error && (
          <Alert
            severity="error"
            sx={{ borderRadius: "10px", fontSize: "0.85rem" }}
          >
            {sellerAuth.error}
          </Alert>
        )}

        <Button
          onClick={sellerAuth.otpSent ? formik.handleSubmit : handleSentOtp}
          disabled={sellerAuth.loading || !formik.values.email}
          fullWidth
          sx={{ py: "12px" }}
          variant="contained"
        >
          {sellerAuth.loading ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : sellerAuth.otpSent ? (
            "Login"
          ) : (
            "Send OTP"
          )}
        </Button>
      </div>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>
    </div>
  );
};

export default SellerLogin;
