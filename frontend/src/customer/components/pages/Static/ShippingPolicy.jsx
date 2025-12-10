import React from "react";
import { Divider } from "@mui/material";

const ShippingPolicy = () => {
  return (
    <div className="lg:px-52 px-5 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      <Divider className="mb-6" />
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">Delivery Timeframe</h2>
          <p>
            Orders within Kathmandu Valley are delivered within 2-3 business
            days. Orders outside Kathmandu are delivered within 5-7 business
            days.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Shipping Charges</h2>
          <p>
            Free shipping on orders above Rs 2000. A flat shipping fee of Rs 100
            applies for orders below Rs 2000.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Order Processing</h2>
          <p>
            Orders are processed within 24 hours of placement. You will receive
            a confirmation email once your order is dispatched.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Delivery Areas</h2>
          <p>
            We currently deliver across all major cities in Nepal including
            Kathmandu, Pokhara, Chitwan, Biratnagar, and Butwal.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Failed Delivery</h2>
          <p>
            If delivery fails due to incorrect address or recipient
            unavailability, we will attempt redelivery once. After that, the
            order will be returned to the seller.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
