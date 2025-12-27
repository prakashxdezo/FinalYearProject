import React, { useState } from "react";
import SellerLogin from "./SellerLogin";
import SellerAccountForm from "./SellerAccountForm";
import { Button } from "@mui/material";

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10">
      {/* Card Container */}
      <div className="grid grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Form Section */}
        <section className="p-12 flex flex-col justify-center">
          <h1 className="logo text-3xl mb-1 text-orange-600">ToyVerse</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            {isLogin ? "Seller Login" : "Become a Toy Seller"}
          </h2>

          {isLogin ? <SellerLogin /> : <SellerAccountForm />}

          <div className="mt-6 space-y-2">
            <h1 className="text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </h1>

            <Button
              onClick={() => setIsLogin(!isLogin)}
              fullWidth
              variant="outlined"
              sx={{
                py: "10px",
                borderRadius: "12px",
              }}
            >
              {isLogin ? "Register" : "Login"}
            </Button>
          </div>
        </section>

        {/* Image Section */}
        <section className="hidden md:block">
          <img
            src="https://dokan.co/app/uploads/2023/05/How-to-Become-an-eCommerce-Seller-1024x559.png"
            alt="Sell toys on ToyVerse"
            className="w-full h-full object-cover"
          />
        </section>
      </div>
    </div>
  );
};

export default BecomeSeller;
