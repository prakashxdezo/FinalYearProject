import React from "react";
import { Divider } from "@mui/material";

const ReturnPolicy = () => {
  return (
    <div className="lg:px-52 px-5 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
      <Divider className="mb-6" />
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">Return Window</h2>
          <p>
            You may return eligible items within 7 days of delivery. Items must
            be unused, unwashed, and in their original packaging with all tags
            intact.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Non-Returnable Items</h2>
          <p>
            The following items cannot be returned: innerwear, swimwear,
            customized products, and items marked as final sale.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Refund Process</h2>
          <p>
            Once your return is received and inspected, we will process your
            refund within 5-7 business days. Refunds are credited to the
            original payment method.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Damaged or Wrong Items</h2>
          <p>
            If you received a damaged or incorrect item, please contact us
            within 48 hours of delivery with photos. We will arrange a free
            replacement or full refund.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            How to Initiate a Return
          </h2>
          <p>
            Go to My Account → Orders → Select the order → Click "Cancel Order".
            Our team will contact you within 24 hours to arrange pickup.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
