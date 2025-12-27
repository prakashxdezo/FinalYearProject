import {
  Button,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/store";
import {
  sendLoginSignupOtp,
  signup,
  resetAuthError,
} from "../Redux Toolkit/features/Auth/AuthSlice";
import { useNavigate } from "react-router";

const SignupForm = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik({
    initialValues: { email: "", otp: "", fullName: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      fullName: auth.otpSent
        ? Yup.string().required("Full name is required")
        : Yup.string(),
      otp: auth.otpSent
        ? Yup.string().required("OTP is required")
        : Yup.string(),
    }),
    onSubmit: (values) => {
      if (!auth.otpSent) {
        dispatch(sendLoginSignupOtp({ email: values.email }));
      } else {
        dispatch(
          signup({
            email: values.email,
            otp: values.otp,
            fullName: values.fullName,
            // navigate is NOT passed — thunk no longer uses it
          }),
        ).then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setSuccessMsg("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
          }
        });
      }
    },
  });

  return (
    <div>
      <h1 className="text-2xl text-center font-bold pb-5">Signup</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="E-mail"
          value={formik.values.email}
          onChange={(e) => {
            formik.handleChange(e);
            if (auth.error) dispatch(resetAuthError());
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={auth.otpSent || auth.loading}
        />

        {auth.otpSent && (
          <>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              disabled={auth.loading}
            />
            <TextField
              fullWidth
              name="otp"
              label="OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
              disabled={auth.loading}
            />
          </>
        )}

        {auth.error && (
          <Alert severity="error" sx={{ borderRadius: "10px" }}>
            {auth.error}
          </Alert>
        )}

        <Button
          fullWidth
          sx={{ py: "12px" }}
          type="submit"
          variant="contained"
          disabled={auth.loading}
        >
          {auth.loading ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : auth.otpSent ? (
            "Create Account"
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>

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

export default SignupForm;
