import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../../config/api";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const EsewaSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const hasVerified = useRef(false); // ✅ guard against double call

  useEffect(() => {
    if (hasVerified.current) return; // ✅ stop second call
    hasVerified.current = true;

    console.log("Full URL:", window.location.href);
    console.log("All params:", Object.fromEntries(searchParams.entries()));

    const encodedData = searchParams.get("data");
    const paymentOrderId = searchParams.get("paymentOrderId");

    console.log("encodedData:", encodedData);
    console.log("paymentOrderId:", paymentOrderId);

    if (!encodedData) {
      setStatus("failed");
      setMessage("No payment data received from eSewa.");
      return;
    }

    api
      .post("/api/payment/esewa/verify", { encodedData, paymentOrderId })
      .then(() => {
        setStatus("success");
        setMessage("Payment verified! Your order has been placed.");
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Payment verification failed.",
        );
      });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "#f8fafc" }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center space-y-5">
        <p className="font-bold text-xl">
          TOY<span style={{ color: "#e85d04" }}>VERSE</span>
        </p>

        {status === "verifying" && (
          <>
            <CircularProgress style={{ color: "#60bb47" }} size={52} />
            <p className="text-gray-600 font-medium">
              Verifying your eSewa payment…
            </p>
            <p className="text-gray-400 text-xs">
              Please wait, do not close this page.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircleIcon style={{ color: "#60bb47", fontSize: 72 }} />
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Successful!
            </h2>
            <p className="text-gray-500 text-sm">{message}</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => navigate("/account/orders")}
                className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: "#60bb47" }}
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <ErrorIcon style={{ color: "#ef4444", fontSize: 72 }} />
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-500 text-sm">{message}</p>
            <button
              onClick={() => navigate("/checkout/address")}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm font-semibold text-white text-sm"
              style={{ background: "#4f46e5" }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EsewaSuccess;
