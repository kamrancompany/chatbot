import React, {useState} from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../style/SignIn.css";

import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      logname: "",
      logemail: "",
      logpass: "",
    },
  });
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.logname);
      formData.append("email", data.logemail);
      formData.append("password", data.logpass);
      let result = await axios({
        url: "http://localhost:8000/users/signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
      });
      if (result.status === 200) {
        const jsonResponse = await result.data;
        const userId = jsonResponse._id;
        console.log("Create New User Successfully:", jsonResponse);
        localStorage.setItem("users", JSON.stringify(result));
        localStorage.setItem("userId", result.data.new_user._id);
        navigate("/auto");
      } else {
        console.error("SignUp failed:", result.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(data);
  };
  return (
    <>
      <div className="card-back">
        <div className="center-wrap">
          <div className="section text-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h4 className="mb-4 pb-3">Sign Up</h4>

              <div className="form-group">
                <input
                  {...register("logname", { required: true })}
                  type="text"
                  name="logname"
                  className="form-style"
                  placeholder="Your Full Name"
                  id="logname"
                  autocomplete="off"
                />

                <i className="input-icon uil uil-user"></i>
              </div>

              <div className="form-group mt-2">
                <input
                  {...register("logemail", { required: true })}
                  type="email"
                  name="logemail"
                  className="form-style"
                  placeholder="Your Email"
                  id="logemail"
                  autoComplete="off"
                />
                <i className="input-icon uil uil-at"></i>
              </div>
              <div className="form-group mt-2">
              <div className="eye-btn-parrent">
                <input
                  {...register("logpass", { required: "true" })}
                  type={showPassword ? "text" : "password"}
                  name="logpass"
                  className="form-style"
                  placeholder="Your Password"
                  id="logpass"
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
              <button className="btn mt-4" type="submit">
                submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
