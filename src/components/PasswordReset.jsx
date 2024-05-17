import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../fbconfig";
import { useNavigate } from "react-router-dom";
import "./PasswordReset.css";

const PasswordReset = () => {
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then((data) => {
        alert("Please check your email!");
        history("/");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  return (
    <div className="password-reset-body">
      <div className="password-reset-container">
        <h1>Enter your email</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input name="email" placeholder="Email" />
          <br />
          <br />
          <button type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
