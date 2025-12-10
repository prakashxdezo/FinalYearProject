import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../../config/api";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useDispatch } from "react-redux";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [txnId, setTxnId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Khalti appends params after /? — parse full URL
    const fullUrl = window.location.href;
    const qs = fullUrl.includes("?") ? fullUrl.split("?").slice(1).join("?") : "";
    const params = new URLSearchParams(qs);

    const pidx = params.get("pidx");
    const khaltiStatus = params.get("status");
    const paymentOrderId = (
      searchParams.get("paymentOrderId") || params.get("paymentOrderId")
    )?.split("/?")[0];

    if (!pidx) { setStatus("failed"); setMessage("No payment ID found."); return; }
    if (khaltiStatus && khaltiStatus !== "Completed") {
      setStatus("failed");
      setMessage("Payment was not completed (status: " + khaltiStatus + ").");
      return;
    }

    api
      .post("/api/payment/verify", { pidx, paymentOrderId })
      .then(({ data }) => {
        if (data.success) {
          setStatus("success");
          setTxnId(data.khaltiData?.transaction_id || "");
          dispatch(clearCart());
        } else {
          setStatus("failed");
          setMessage(data.message || "Verification failed");
        }
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(
          err.response?.data?.error?.detail ||
          err.response?.data?.error ||
          err.message
        );
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#f8fafc" }}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center space-y-5">
        <p className="font-bold text-xl">
          TOY<span style={{ color: "#e85d04" }}>VERSE</span>
        </p>

        {status === "verifying" && (
          <>
            <CircularProgress style={{ color: "#5D2D8E" }} size={52} />
            <p className="text-gray-600 font-medium">Verifying your Khalti payment…</p>
            <p className="text-gray-400 text-xs">Please wait, do not close this page.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircleIcon style={{ color: "#16a34a", fontSize: 72 }} />
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 text-sm">Your order has been placed and payment confirmed via Khalti.</p>
            {txnId && (
              <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-100">
                <p className="text-xs text-green-600 font-semibold">Transaction ID</p>
                <p className="text-sm font-mono text-green-800 mt-0.5">{txnId}</p>
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => navigate("/account/orders")} className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm" style={{ background: "#5D2D8E" }}>
                View Orders
              </button>
              <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50">
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <ErrorIcon style={{ color: "#ef4444", fontSize: 72 }} />
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-500 text-sm">{message || "Something went wrong with your payment."}</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => navigate("/checkout/address")} className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm" style={{ background: "#4f46e5" }}>
                Try Again
              </button>
              <button onClick={() => navigate("/cart")} className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50">
                Back to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
