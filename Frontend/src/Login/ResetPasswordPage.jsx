import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("resetEmail");

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("resetEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location.state]);

  const goToLogin = () => {
    navigate("/login");
  };

  if (!email) {
    return <div>Email is missing. Go back and request OTP again.</div>;
  }

  return <ResetPassword email={email} goToLogin={goToLogin} />;
}

export default ResetPasswordPage;
