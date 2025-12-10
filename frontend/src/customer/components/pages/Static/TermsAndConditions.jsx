import React from "react";
import { Divider } from "@mui/material";

const Terms = () => {
  return (
    <div className="lg:px-52 px-5 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <Divider className="mb-6" />
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
          <p>
            By using ToyVerse, you agree to these terms. If you disagree,
            please do not use our platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. Notify us immediately of any unauthorized use
            of your account.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Product Listings</h2>
          <p>
            Sellers are responsible for the accuracy of their product listings.
            ToyVerse reserves the right to remove listings that violate
            our policies.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Pricing</h2>
          <p>
            All prices are in Nepali Rupees (NPR). ToyVerse reserves the
            right to modify prices at any time without prior notice.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            ToyVerse is not liable for any indirect, incidental, or
            consequential damages arising from the use of our platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
          <p>
            These terms are governed by the laws of Nepal. Any disputes shall be
            resolved in the courts of Kathmandu.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
