import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../../../Redux Toolkit/store";
import { createOrder } from "../../../../Redux Toolkit/features/customer/orderSlice";
import { useNavigate } from "react-router";
import { api } from "../../../../config/api";

const AddressForm = ({ paymentGateway }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEsewaPayment = async (orderId) => {
    try {
      const res = await api.post("/api/payment/esewa/initiate", { orderId });
      const { esewaUrl, formData } = res.data;

      // Auto-submit POST form to eSewa gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewaUrl;
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("eSewa initiate error:", err);
      alert("eSewa payment initiation failed. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: { name: "", mobile: "", address: "", city: "", state: "", pinCode: "", locality: "" },
    onSubmit: async (values) => {
      try {
        const jwt = localStorage.getItem("jwt");
        const result = await dispatch(
          createOrder({ address: values, jwt, paymentGateway })
        ).unwrap();

        if (paymentGateway === "KHALTI") {
          if (result.khaltiLink) {
            window.location.href = result.khaltiLink;
          } else {
            alert("No Khalti payment link received.");
          }
        } else if (paymentGateway === "ESEWA") {
          const paymentOrderId = result.paymentOrderId || result.paymentOrder?._id;
          if (paymentOrderId) {
            await handleEsewaPayment(paymentOrderId);
          } else {
            alert("Could not get payment order ID for eSewa.");
          }
        } else {
          // COD
          alert("Order placed successfully! Pay on delivery.");
          navigate("/account/orders");
        }
      } catch (error) {
        console.error("Order creation failed:", error);
        alert("Failed to create order: " + (error?.message || JSON.stringify(error)));
      }
    },
  });

  const btnLabel = formik.isSubmitting ? "Processing…"
    : paymentGateway === "KHALTI" ? "Proceed to Khalti"
    : paymentGateway === "ESEWA" ? "Proceed to eSewa"
    : "Place COD Order";

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <p className="text-xl font-bold text-center pb-5">Delivery Details</p>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth name="name" label="Full Name" value={formik.values.name} onChange={formik.handleChange} required />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth name="mobile" label="Mobile" value={formik.values.mobile} onChange={formik.handleChange} required />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth name="pinCode" label="Postal Code" value={formik.values.pinCode} onChange={formik.handleChange} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth name="address" label="Address (house no, street)" value={formik.values.address} onChange={formik.handleChange} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth name="locality" label="Locality / Area" value={formik.values.locality} onChange={formik.handleChange} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth name="city" label="City" value={formik.values.city} onChange={formik.handleChange} required />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth name="state" label="Province / State" value={formik.values.state} onChange={formik.handleChange} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                sx={{
                  py: "14px", borderRadius: "10px", textTransform: "none",
                  fontWeight: 700, fontSize: "1rem",
                  ...(paymentGateway === "ESEWA" ? { background: "#60bb47", "&:hover": { background: "#4caf3a" } } : {}),
                }}
                type="submit" variant="contained" fullWidth disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? <CircularProgress size={22} color="inherit" /> : btnLabel}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default AddressForm;
