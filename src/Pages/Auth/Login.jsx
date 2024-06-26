import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../Spinner"; // Assuming Spinner.js is in the same directory

function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!phone.trim()) {
        toast.error("Enter Phone Number");
      } else if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
        toast.error("Phone number must be of 10 digits");
      } else {
        setLoading(true);
        const body = {
          phone_number: phone,
        };

        const response = await Api.post("api/send_sms/", body);
        setLoading(false);
        console.log("OTP sent successfully");
        navigate("/loginotp", { state: { phone: phone } });
        setPhone("");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please try again later.");
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
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h3>
        <h6>Enter the Phone Number</h6>
        <input
          type="mobile"
          placeholder="Enter the Phone Number"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="form-control input-box form-foodwagon-control"
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#F17228",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
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
          <text>Don't have an account?</text>
          <button
            style={{}}
            className="btn text-warning"
            type="button"
            onClick={handleClick}
          >
            <text style={{ color: "black" }}>Signup</text>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
