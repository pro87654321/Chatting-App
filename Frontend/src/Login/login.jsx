import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const API_ENDPOINT = "http://localhost:8080/api/auth/login";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError("");

        try {
            const res = await axios.post(
                `${API_ENDPOINT}?email=${data.email}&password=${data.password}`,
                {}, //  Remove username and password from the request body
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(res.data);
            alert(res.data);

            // Check for successful login before navigating
            if (res.data === "Login successful!") { // Assuming 200 OK indicates success
                navigate("/ChatScreen");
                localStorage.setItem("loggedInEmail", data.email);
            } else {
                // Handle unsuccessful login (e.g., display error message)
                setLoginError("Login failed. Please check your credentials.");
                navigate("/");
            }

        } catch (error) {
            console.error("Login failed:", error);
            setLoginError("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpClick = () => {
        navigate("/signup");
    };
    const goTo = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Circular background shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10"></div>

            <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] relative z-10">
                <div className="flex flex-col md:flex-row">
                    {/* Welcome Section (Left Side) */}
                    <div className="w-full md:w-1/2 py-10 px-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col items-start justify-center relative">
                        <h2 className="text-4xl font-bold mb-4">Welcome</h2>
                        <p className="text-lg">Your Headline Name</p>
                    </div>

                    {/* Sign In Form (Right Side) */}
                    <div className="w-full md:w-1/2 py-10 px-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>
                        {loginError && (
                            <div className="text-red-500 mb-4">
                                {loginError}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {/* Email Input */}
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
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        {...register("password", { required: "Password is required" })}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <a
                                    href="#"
                                    onClick={goTo}
                                    className="text-sm text-blue-500 hover:underline focus:outline-none"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                >
                                    {isLoading ? "Logging in..." : "Sign In"}
                                </button>
                            </div>
                        </form>

                        {/* Sign up Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleSignUpClick}
                                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;