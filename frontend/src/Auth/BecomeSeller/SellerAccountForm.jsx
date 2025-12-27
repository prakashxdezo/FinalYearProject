import {
  Button,
  Step,
  StepLabel,
  Stepper,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import BecomeSellerStep1 from "./BecomeSellerStep1";
import BecomeSellerStep2 from "./BecomeSellerStep2";
import BecomeSellerStep3 from "./BecomeSellerStep3";
import BecomeSellerStep4 from "./BecomeSellerStep4";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { createSeller } from "../../Redux Toolkit/features/seller/sellerAuthentication";
import { useNavigate } from "react-router";

const steps = ["Mobile", "Pickup Address", "Bank Details", "Business Details"];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellerAuth } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      pickupAddress: {
        name: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        locality: "",
      },
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
      },
      sellerName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
        logo: "",
        banner: "",
        businessAddress: "",
      },
      password: "",
    },
    onSubmit: (values) => {
      setErrorMsg("");
      dispatch(createSeller(values)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setSuccessMsg(
            "Account created! Your account is pending admin approval. Redirecting to login...",
          );
          setTimeout(() => navigate("/seller/login"), 3000);
        } else {
          setErrorMsg(
            result.payload || "Failed to create account. Please try again.",
          );
        }
      });
    },
  });

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 space-y-10">
        {activeStep === 0 && <BecomeSellerStep1 formik={formik} />}
        {activeStep === 1 && <BecomeSellerStep2 formik={formik} />}
        {activeStep === 2 && <BecomeSellerStep3 formik={formik} />}
        {activeStep === 3 && <BecomeSellerStep4 formik={formik} />}
      </div>

      {errorMsg && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
          {errorMsg}
        </Alert>
      )}

      <div className="flex items-center justify-between mt-5">
        <Button
          variant="contained"
          disabled={activeStep === 0 || sellerAuth?.loading}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>

        <Button
          variant="contained"
          disabled={sellerAuth?.loading}
          onClick={
            activeStep === steps.length - 1
              ? formik.handleSubmit
              : () => setActiveStep((prev) => prev + 1)
          }
        >
          {activeStep === steps.length - 1 ? (
            sellerAuth?.loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Create Account"
            )
          ) : (
            "Next"
          )}
        </Button>
      </div>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>
    </div>
  );
};

export default SellerAccountForm;
