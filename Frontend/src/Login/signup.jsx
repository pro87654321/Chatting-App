// components/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const API_ENDPOINT = "http://localhost:8080/api/auth/signup";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [signupMessage, setSignupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");
  const navigate = useNavigate(); // Hook for navigation

  const goToLogin = () => {
    navigate("/login"); // Navigate to login page
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSignupMessage("");

    try {
      const res = await axios.post(API_ENDPOINT, data);
      console.log(data);
      setSignupMessage("Signup successful!");
      console.log(res.data);
    } catch (error) {
      setSignupMessage("Signup failed. Please try again.");
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
            Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name"
                  {...register("userName", { required: "Name is required" })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

          
            <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel" // Use type="tel" for phone numbers
                placeholder="Mobile No.."
                {...register("phone", {
                  required: "Mobile No. is required",
                  minLength: {
                    value: 10,
                    message: "Mobile No. should be at least 10 digits",
                  },
                  maxLength: {
                    value: 15, // Adjust as needed for international numbers
                    message: "Mobile No. should not exceed 15 digits",
                  },
                  pattern: {
                    value: /^[0-9]+$/, // Basic numeric validation
                    message: "Mobile No. should contain only digits",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
        {errors.phone && (  // Corrected: errors.phone
          <p className="text-red-500 text-sm mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>
      



            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 shadow-md"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            {signupMessage && (
              <p
                className={`mt-4 text-center ${
                  signupMessage.startsWith("Failed")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {signupMessage}
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={goToLogin}
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

export default Signup;