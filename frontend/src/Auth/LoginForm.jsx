import {
  Button,
  TextField,
  Box,
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
  signin,
  resetAuthError,
} from "../Redux Toolkit/features/Auth/AuthSlice";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik({
    initialValues: { email: "", otp: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      otp: auth.otpSent
        ? Yup.string().required("OTP is required")
        : Yup.string(),
    }),
    onSubmit: (values) => {
      if (!auth.otpSent) {
        dispatch(sendLoginSignupOtp({ email: values.email }));
      } else {
        dispatch(signin({ email: values.email, otp: values.otp })).then(
          (result) => {
            if (result.meta.requestStatus === "fulfilled") {
              const role = result.payload.role;
              setSuccessMsg("Login successful! Redirecting...");
              setTimeout(() => {
                if (role === "ROLE_ADMIN") navigate("/admin");
                else navigate("/");
              }, 2000);
            }
          },
        );
      }
    },
  });

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="white"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      <form onSubmit={formik.handleSubmit}>
        <Box mb={2}>
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
        </Box>

        {auth.otpSent && (
          <Box mb={2}>
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
          </Box>
        )}

        {auth.error && (
          <Box mb={2}>
            <Alert severity="error" sx={{ borderRadius: "10px" }}>
              {auth.error}
            </Alert>
          </Box>
        )}

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={auth.loading}
            sx={{ py: "12px" }}
          >
            {auth.loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : auth.otpSent ? (
              "Login"
            ) : (
              "Send OTP"
            )}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
