import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email = location.state ? location.state.email : null;
  const otpCode = location.state ? location.state.code : null;

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    // Handle form submission logic here
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otpCode", otpCode);
      formData.append("password", data.newPassword);

      let result = await axios({
        url: "http://localhost:8000/users/change-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
      });

      if (result.status === 200) {
        const jsonResponse = await result.data;
        console.log(jsonResponse);
      
        if (jsonResponse.message === "Password is successfully Changed") {
          // console.log("Success:", jsonResponse.message);
          Swal.fire({
            title: "Success",
            text: "Password is Successfully Changed",
            icon: "success"
          });

          navigate("/signin");
        } else if (jsonResponse.message === "Token Expire") {
          // console.error("Token Expired:", jsonResponse.message);
          setError(jsonResponse.message);
          // Handle token expired logic here
        } else if (jsonResponse.message === "Invalid OTP") {
          // console.error("Invalid OTP:", jsonResponse.message);
          setError(jsonResponse.message);
          // Handle invalid OTP logic here
        } else {
          // console.error(" Password change failed:", jsonResponse.message);
          setError(jsonResponse.message);
          // Handle other failure cases here
        }
      } else {
        // Handle non-200 status (e.g., show an error message)
        console.error("Error:", result.statusText);
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error:", error);
    }
   
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Reset Password</h4>
                          {/* <p>{email}</p>
                          <p>{otpCode}</p> */}
                          <div className="form-group mt-2">
                            <div className="eye-btn-parrent">
                            <input
                              type={showPassword ? "text" : "password"}
                              {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                  value: 6,
                                  message: "Password must be at least 6 characters long",
                                },
                              })}
                              className={`form-style ${errors.newPassword ? "error" : ""}`}
                              placeholder="Your New Password"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                            <button
                              type="button"
                              className="eye-button eye-btn-styling"
                              onClick={handleTogglePassword}
                            >
                              {showPassword ? "👁️" : "👁️"}
                            </button>
                            </div>
                          </div>
                          <div className="form-group mt-2">
                            <div className="eye-btn-parrent">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              {...register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: (value) => value === watch("newPassword") || "Passwords do not match",
                              })}
                              className={`form-style ${errors.confirmPassword ? "error" : ""}`}
                              placeholder="Confirm Password"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                            <button 
                              type="button"
                              className="eye-button eye-btn-styling"
                              onClick={handleToggleConfirmPassword}
                            >
                              {showConfirmPassword ? "👁️" : "👁️"}
                            </button>
                            {errors.confirmPassword && (
                              <p className="error-message">{errors.confirmPassword.message}</p>
                            )}
                            </div>
                          </div>
                          <p style = {{color:"red"}}> {error && error}</p>
                          <button type="submit" className="btn mt-4">
                            Update Password
                          </button>
                          <p className="mb-0 mt-4 text-center">
                            <Link to="/otp"><ArrowBackIcon />Back</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
