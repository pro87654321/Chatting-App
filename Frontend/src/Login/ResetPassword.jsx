import React, { useState } from "react";
import axios from "axios";
import { Lock, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const API_ENDPOINT = "http://localhost:8080/api/auth/reset-password";

function ResetPassword({ email, goToLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setResetMessage("");

    try {
      const res = await axios.post(
        `${API_ENDPOINT}?email=${email}&newPassword=${data.newPassword}`
      );
      setResetMessage("Password reset successfully!");
      console.log(res.data);
    } catch (error) {
      setResetMessage("Failed to reset password. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleSignUpClick = () => {
        navigate("/login");
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="py-10 px-10">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  {...register("confirmNewPassword", {
                    required: "Confirm new password is required",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 shadow-md"
              >
                {isLoading ? "Resetting..." : "Reset"}
              </button>
            </div>

            {resetMessage && (
              <p
                className={`mt-4 text-center ${
                  resetMessage.startsWith("Failed") ? "text-red-500" : "text-green-500"
                }`}
              >
                {resetMessage}
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleSignUpClick}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;