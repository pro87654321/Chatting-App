import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // ✅ Fix: pass 'email' as argument
  const goToOtp = (email) => {
    navigate("/verify-otp", { state: { email } });
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: data.email,
      });

      if (response.status === 200) {
        localStorage.setItem("resetEmail", data.email); // Optional fallback
        goToOtp(data.email); // ✅ Pass email here
      } else {
        alert("Failed to send OTP. Please check your email address or try again later.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check your email address or try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-md border rounded">
      <h2 className="text-xl mb-4 font-semibold text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
