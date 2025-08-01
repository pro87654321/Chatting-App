import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyOtp from "./VerifyOtp";

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Initialize from localStorage if available
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("resetEmail") || "";
  });

  useEffect(() => {
    const stateEmail = location.state?.email;

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("resetEmail", stateEmail);
    }
  }, [location.state]);

  // ✅ Called from VerifyOtp when OTP is verified successfully
  const goToReset = () => {
    if (email) {
      localStorage.setItem("resetEmail", email); // extra safety
      navigate("/reset-password", { state: { email } });
    } else {
      alert("Email is missing, cannot proceed to reset.");
    }
  };

  // ✅ Fallback UI if email is still missing
  if (!email) {
    return (
      <div className="text-red-600 text-center mt-20">
        Email is missing. Please go back and request OTP again.
      </div>
    );
  }

  return <VerifyOtp email={email} goToReset={goToReset} />;
}

export default VerifyOtpPage;
