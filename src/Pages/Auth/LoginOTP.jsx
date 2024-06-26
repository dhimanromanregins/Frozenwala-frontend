import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../Spinner"; // Assuming Spinner.js is in the same directory

function LoginOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let location = useLocation();
  let { phone } = location.state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (otp === "") {
        toast.error("Enter OTP!");
      } else {
        setLoading(true);
        const body = {
          otp_value: otp,
          phone_number: phone,
        };
        const response = await axios.post(
          "https://app.frozenwala.com/base/login/",
          body
        );
        setLoading(false);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("access_token", response.data.access);
        navigate("/home");
        setOtp("");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Invalid OTP");
      console.log(error);
    }
  };

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FFB30E",
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
        data-navbar-on-scroll="data-navbar-on-scroll"
      >
        <div className="container">
          <a
            className="navbar-brand d-inline-flex"
            href="https://app.frozenwala.com/base"
          >
            <img
              className="d-inline-block"
              style={{ height: "50px" }}
              src="/img/gallery/Frozenwala.png"
              alt="logo"
            />
            <span className="text-1000 fs-3 fw-bold ms-2 text-gradient">
              Frozenwala Food
            </span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> </span>
          </button>
          <div
            className="collapse navbar-collapse border-top border-lg-0 my-2 mt-lg-0"
            id="navbarSupportedContent"
          >
            <div className="mx-auto pt-5 pt-lg-0 d-block d-lg-none d-xl-block" />

            <form className="d-flex mt-4 mt-lg-0 ms-lg-auto ms-xl-0">
              <button
                className="btn btn-white shadow-warning text-warning"
                type="submit"
              >
                <i className="fas fa-user me-2"></i>About us
              </button>
            </form>
          </div>
        </div>
      </nav>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "500px",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
          backgroundColor: "#F9FAFD",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          One Time Password (OTP)
        </h3>
        <h6>Enter the OTP</h6>
        <input
          type="number"
          placeholder="Enter the OTP"
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control input-box form-foodwagon-control"
        />
        <button
          type="submit"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#F17228",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
            height: "35px",
          }}
        >
          {loading ? <Spinner /> : "Submit"}
        </button>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            marginTop: "10px",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <span>Don't received?</span>
          <button
            className="btn text-warning"
            type="button"
            onClick={handleClick}
          >
            <span style={{ color: "black" }}>Resend</span>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default LoginOTP;
