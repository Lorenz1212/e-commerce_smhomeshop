import React from 'react'
import { Link } from "react-router-dom";
import popupImg from "../../../assets/newsletter-popup.jpg";

const LoginModal = () => {
  return (
    <>
      <div className="popup-left">
        <img src={popupImg} alt="Newsletter" />
      </div>
      <div className="popup-right">
        {/* ✅ Reminder message */}
        <div className="popup-reminder">
          <h3>Reminder</h3>
          <p>
            Please log in or create an account to continue shopping
            and access exclusive deals.
          </p>
        </div>

        <Link className="login-button-black" to="/login-signup?tab=login">
          Login
        </Link>
        <Link className="login-button-white" to="/login-signup?tab=register">
          Sign Up
        </Link>
      </div>
    </>
  )
}

export { LoginModal }
 