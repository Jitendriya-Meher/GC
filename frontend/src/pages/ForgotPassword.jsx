import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {

  const [state, setState] = React.useState("step1");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { setShowUserLogin , axios, navigate} = useAppContext();

  const submitHandler = async (e) => {

    e.preventDefault();
    
    try {

      if( state=="step1"){

        const {data} = await axios.post("/api/user/send-reset-otp",{
            email
        });

        if( data.success){
            toast.success(data.message);
            setState("step2");
        }
        else{
            toast.error(data.message);
        }

      }
      else{

        if( password !== confirmPassword){
            toast.error("new password and confirm new password doesn't mathes");
            return;
        }

        const {data} = await axios.post("/api/user/reset-password",{
            email,
            otp,
            newPassword: password
        });

        if( data.success){
            toast.success(data.message);
            navigate("/");
        }
        else{
            toast.error(data.message);
        }

      }
      
    } catch (error) {
      toast.error(error.message);
    }

  }

  return (
    <div
      className=" fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
      onClick={() => {
        setShowUserLogin(false);
      }}
    >
      <form
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={submitHandler}
      >
        <p className="text-2xl font-medium m-auto">
          {state === "step1" ? "Send OTP" : "Forgot Password"}
        </p>

        {state === "step1" && <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>}
        {state==="step2" && <div className="w-full ">
          <p>OTP</p>
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>}
        {state==="step2" && <div className="w-full ">
          <p>New Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>}

        {state==="step2" && <div className="w-full ">
          <p>Confirm New Passwoord</p>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>}
        
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "step1" ? "Send OTP" : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;