import React, { useState, useEffect } from "react";
import axios from "axios";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";

function VerifyOtp({ email: propEmail, goToReset }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState(propEmail || "");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load email from localStorage if not passed as prop
  useEffect(() => {
    if (!propEmail) {
      const savedEmail = localStorage.getItem("resetEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        setVerificationMessage("Email is missing. Please go back and request OTP again.");
      }
    }
  }, [propEmail]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setVerificationMessage("");

    try {
      const res =await axios.post("http://localhost:8080/api/auth/verify-otp", {
  email,
  otp: data.otp,
});

      if (res.data === "OTP verified successfully!") {
        localStorage.removeItem("resetEmail"); // ✅ cleanup
        console.log("Email" + email);
        goToReset(); // ✅ navigate to reset password
      } else {
        setVerificationMessage("Invalid OTP");
      }
    } catch (error) {
      setVerificationMessage("Verification failed. Please try again.");
      console.log("Email" + email);
      console.log("OTP" + data.otp);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="py-10 px-10">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Verify OTP
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be a 6-digit number",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 shadow-md"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            {verificationMessage && (
              <p
                className={`mt-4 text-center ${
                  verificationMessage === "Invalid OTP" || verificationMessage.includes("missing")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {verificationMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;