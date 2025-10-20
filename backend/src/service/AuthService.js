const bcrypt=require('bcrypt');
const Seller = require("../model/Seller");
const User = require("../model/User");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../util/generateOtp");
const sendVerificationEmail = require("../util/sendEmail");
const Cart = require('../model/cart');
const jwtProvider = require('../util/jwtProvider');
const userService = require('./userService');

class AuthService {
  async sendLoginOTP(email) {
    console.log("Service sending OTP to:", email);
    
    const seller = await Seller.findOne({ email });
    const user = await User.findOne({email})

    if (!seller && !user) {
      console.log("New user — will create account after OTP verification");
    }

    const existingVerificationCode = await VerificationCode.findOne({ email });
    if (existingVerificationCode) {
      await VerificationCode.deleteOne({ email });
    }

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();

    const subject = "ToyVerse - Your Login OTP";
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4f46e5;">ToyVerse</h2>
        <p>Hello! Your one-time password (OTP) for ToyVerse is:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #111;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;"/>
        <p style="color: #9ca3af; font-size: 12px;">© ToyVerse. All rights reserved.</p>
      </div>
    `;
    await sendVerificationEmail(email, subject, body);

    return { message: "OTP sent" };

  }

  async createUser(req){
    const {email, fullName, otp}=req;

    let user=await User.findOne({email});

    if(user){
      throw new Error("User already exists with email");
    }

    const verificationCode = await VerificationCode.findOne({email});

    if(!verificationCode || verificationCode.otp!==otp){
      throw new Error ("Invalid OTP..");
    }


    user=new User({
      email, fullName
    })

    await user.save();
  
    const cart=new Cart({user:user._id})
    await cart.save();

    return jwtProvider.createJwt({email})
  }

  async signin(req){
    const{email,otp}=req;
    const user= await User.findOne({email});

    if(!user){
      throw new Error("User not found with email");
    }
    const verificationCode = await VerificationCode.findOne({email});

    if (!verificationCode || verificationCode.otp!==otp){
      throw new Error("Invalid OTP");
    }

    return{
      message: "lOGIN SUCCESS",
      jwt: jwtProvider.createJwt({email}),
      role:user.role
    }
  } 
}

module.exports=new AuthService();