import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

const EsewaFailure = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center space-y-5">
        <ErrorIcon style={{ color: "#ef4444", fontSize: 64 }} />
        <h2 className="text-2xl font-bold text-gray-800">Payment Cancelled</h2>
        <p className="text-gray-500 text-sm">Your eSewa payment was not completed. No charges were made.</p>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={() => navigate("/checkout/address")} className="px-5 py-2.5 rounded-lg font-semibold text-white text-sm" style={{ background: "#4f46e5" }}>
            Try Again
          </button>
          <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-200">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EsewaFailure;
