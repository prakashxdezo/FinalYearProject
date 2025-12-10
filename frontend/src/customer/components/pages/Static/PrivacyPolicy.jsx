import React from "react";
import { Divider } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <div className="lg:px-52 px-5 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <Divider className="mb-6" />
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p>
            We collect information you provide when creating an account, placing
            orders, or contacting us — including name, email, phone number, and
            delivery address.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to process orders, send order updates,
            improve our services, and communicate offers. We never sell your
            personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Payment Security</h2>
          <p>
            All payment transactions are processed through Khalti's secure
            payment gateway. We do not store your payment card details on our
            servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience and remember your
            preferences. You can disable cookies in your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>
            For privacy-related concerns, email us at privacy@crystalthread.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
