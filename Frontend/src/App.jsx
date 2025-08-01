import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Login/signup";
import Login from "./Login/login";
import ForgotPassword from "./Login/Forgotpassword";
import VerifyOtpPage from "./Login/VerifyOtpPage";
import Sidebar from './Chat/Sidebar';
import ResetPasswordPage from "./Login/ResetPasswordPage";
import ChatScreen from "./Chat/ChatScreen";

import ErrorBoundary from "./ErrorBoundary"; // 🛡️ Custom error handler

function App() {
  const [currentEmail, setCurrentEmail] = useState("");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword setEmail={setCurrentEmail} />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage email={currentEmail} />} />
        <Route 
          path="/ChatScreen" 
          element={
            <ErrorBoundary>
              <ChatScreen />
            </ErrorBoundary>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
