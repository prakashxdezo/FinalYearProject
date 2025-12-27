import { Button, Snackbar } from "@mui/material";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import store, { useAppSelector } from "../Redux Toolkit/store";

const Auth = () => {
  const {auth}=useAppSelector(store=>store)
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden">
        {/* Top image */}
        <div className="w-full h-40 bg-orange-500 flex items-center justify-center relative overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-60"
            src="https://cdn.vectorstock.com/i/preview-1x/68/31/facade-of-toy-store-isolate-vector-9166831.jpg"
            alt="ToyVerse"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="logo text-4xl text-white drop-shadow-lg">
              ToyVerse
            </h1>
          </div>
        </div>

        {/* Form section */}
        <div className="p-8">
          {isLogin ? <LoginForm /> : <SignupForm />}

          {/* Switch between login/signup */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="text"
              className="text-blue-600"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Signup" : "Login"}
            </Button>
          </div>
        </div>
      </div>
      <Snackbar
        open={auth.otpSent}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="OTP sent successfully!"
      />
    </div>
  );
};

export default Auth;
