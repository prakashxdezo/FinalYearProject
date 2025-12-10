import React, { useState, useEffect } from "react";
import { Box, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Addresscard from "./Addresscard";
import AddressForm from "./AddressForm";
import Pricingcard from "../Cart/Pricingcard";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { fetchCart } from "../../../../Redux Toolkit/features/customer/cartSlice";

const PAYMENT_METHODS = [
  {
    name: "KHALTI",
    label: "Khalti",
    color: "#5D2D8E",
    logo: "https://khalti.com/static/img/khalti-logo.png",
    desc: "Pay via Khalti digital wallet",
  },
  {
    name: "ESEWA",
    label: "eSewa",
    color: "#60bb47",
    logo: "https://esewa.com.np/common/images/esewa_logo.png",
    desc: "Pay via eSewa — Nepal's #1 wallet",
  },
  {
    name: "COD",
    label: "Cash on Delivery",
    color: "#f59e0b",
    logo: null,
    desc: "Pay when your order arrives",
  },
];

const modalStyle = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)", width: 500,
  bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2,
};

const Checkout = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((store) => store.cart);
  const cartItems = cart.cart?.cartItems || [];

  const [paymentGateway, setPaymentGateway] = useState("KHALTI");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(fetchCart(jwt));
  }, [dispatch]);

  const getCartItems = () =>
    cartItems.map((item) => ({
      id: item.product?._id || item.product,
      name: item.product?.name || "Product",
      price: item.sellingPrice,
      quantity: item.quantity,
    }));

  return (
    <Box className="pt-10 px-5 sm:px-10 md:px-24 lg:px-40 min-h-screen pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="space-y-6 lg:space-y-0 lg:grid grid-cols-3 lg:gap-8">
        {/* Left */}
        <div className="col-span-2 space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-gray-700 mb-4">Choose Payment Method</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((pm) => {
                const active = paymentGateway === pm.name;
                return (
                  <button
                    key={pm.name}
                    onClick={() => setPaymentGateway(pm.name)}
                    className="rounded-xl border-2 p-4 text-left transition-all duration-150"
                    style={{
                      borderColor: active ? pm.color : "#e5e7eb",
                      background: active ? `${pm.color}10` : "#fafafa",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {pm.logo ? (
                        <img src={pm.logo} alt={pm.label} className="h-6 object-contain" onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <span className="text-2xl">💵</span>
                      )}
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: active ? pm.color : "#d1d5db" }}
                      >
                        {active && <div className="w-2 h-2 rounded-full" style={{ background: pm.color }} />}
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-gray-800">{pm.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{pm.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address Form */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-gray-700 mb-4">Delivery Address</p>
            <AddressForm paymentGateway={paymentGateway} />
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-700">Order Summary</p>
            </div>
            <Pricingcard cartItems={getCartItems()} />
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: PAYMENT_METHODS.find((m) => m.name === paymentGateway)?.color }}
                />
                <p className="text-xs text-gray-500 font-medium">
                  Paying via {PAYMENT_METHODS.find((m) => m.name === paymentGateway)?.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <AddressForm paymentGateway={paymentGateway} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Checkout;
