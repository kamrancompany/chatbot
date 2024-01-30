import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPasswordEmail = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("")
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      logemail: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("email", data.logemail);

      let result = await axios({
        url: "http://localhost:8000/users/send-email",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
      });

      if (result.status === 200) {
        const jsonResponse = await result.data;
        console.log(jsonResponse);
        

        if (jsonResponse.statusText === "success") {
          console.log("Valid email:", data.logemail);
          // setEmail(data.logemail);
          // User exists, navigate to the OTP page
          navigate("/otp",{ state: { email: data.logemail } });
        } else {
          // User does not exist, handle it (e.g., show an error message)
          console.error("User Not Exist:", jsonResponse.message);
          setError(jsonResponse.message);
        }
      } else {
        // Handle non-200 status (e.g., show an error message)
        console.error("Error:", result.statusText);
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error:", error);
    }

    console.log(data);
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
                      <div className="section text-center">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <h4 className="mb-4 pb-3">Forget Password</h4>
                          <div className="form-group">
                            <input
                              {...register("logemail", { required: true })}
                              type="email"
                              name="logemail"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail"
                              autocomplete="off"
                            />
                            <i className="input-icon uil uil-at"></i>
                            <span style={{ marginLeft: "2rem", color: "red" }}>
                              {errors.logemail?.type === "required" &&
                                "E-mail is required"}
                              {errors.logemail?.type === "pattern" &&
                                "Not a valid Email"}
                              {error && error}
                            </span>
                          </div>
                          <button type="submit" className="btn mt-4">
                            Send OTP
                          </button>
                          <p className="mb-0 mt-4 text-center">
                            <Link to="/signin">Sign In</Link>
                          </p>
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
    </div>
  );
};

export default ForgetPasswordEmail;
