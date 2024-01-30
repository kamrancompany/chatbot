import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; 
import axios from "axios";

import "../style/SignIn.css";

import { Link,useNavigate } from 'react-router-dom';
import SignUp from "./SignUp";

const SignIn = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState('')
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      email:"",
      password:""
    },
  });
  useEffect (()=>{
    const auth = localStorage.getItem('users')
    if(auth){
      navigate('/')
    }
  },[])

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (data) => {
    const formData = {
      email: getValues("email"),
      password: getValues("password"),
    };
  
    try {
      let response = await axios({
        url: 'http://localhost:8000/users/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: formData,
      });
    
      // console.log('Response status:', response.status);
    
      if (response.status === 200) {
        
        const jsonResponse = await response.data;
        // console.log("Logged in:", jsonResponse);
        const userId = jsonResponse._id;
        localStorage.setItem("users", JSON.stringify(response))
        localStorage.setItem("userId", response.data._id)
        navigate('/auto');
      } else if (response.status === 401) {
        console.error("Login failed:", response.statusText);
    
        
        if (response.data && response.data.error) {
          setError(response.data.error);
        } else {
          setError("Invalid email or password.");
        }
      } else {
        console.error("Unexpected response:", response.statusText);
        setError("An unexpected error occurred during login.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("User not Found");
    }
  }; 
  return (
    <>
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In </span>
                  <span>Sign Up</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                />
                <label for="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <div className="form-group">
                          
                            <input
                             {...register("email",{ required : "true"})}
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail_log_in"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-at"></i>
                         
                          </div>
                          <div className="form-group mt-2">
                          <div className="eye-btn-parrent">
                            <input
                             type={showPassword ? "text" : "password"}
                             {...register("password",{required:"true"})}
                              // type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              id="logpass_log_in"
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
                            <div style={{color:"red"}}>{error}</div>
                          </div>
                          <button type='submit' className="btn mt-4">
                            submit
                          </button>
                          </form>
                          
                          <p className="mb-0 mt-4 text-center">
                              <Link to="/forget" >
                              Forgot your password?
                              </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                    <SignUp/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
