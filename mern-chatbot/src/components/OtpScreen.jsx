import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const OtpScreen = () => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const location = useLocation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [otpData, setOtpData] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);

  const email = location.state ? location.state.email : null;
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length === 0 && index > 0 && inputRefs[index - 1]?.current) {
      // Move focus to the previous input field
      inputRefs[index - 1].current.focus();
    } else if (value.length === 1 && index < inputRefs.length - 1 && inputRefs[index + 1]?.current) {
      // Move focus to the next input field
      inputRefs[index + 1].current.focus();
    }

    const updatedOtpData = [...otpData];
    updatedOtpData[index] = value;
    setOtpData(updatedOtpData.join(''));
  };

  const onSubmit = (data) => {
    // Handle form submission logic here
    navigate("/reset-pass", { state: { code: otpData, email: email } });
    console.log(data);
  };

  useEffect(() => {
    let timer;

    if (timerActive) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timerActive]);

  useEffect(() => {
    if (countdown === 0) {
      setTimerActive(false);
      // Handle timer expiration logic here
    }
  }, [countdown]);

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
                        <h4 className="mb-4 pb-3">Otp Code</h4>
                        <p>Check your this E-mail: <span style={{ color: "#87CEEB" }}>{email}</span></p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="form-group">
                            {[0, 1, 2, 3].map((index) => (
                              <input
                                key={index}
                                className={`otp-box ${errors[`otp${index}`] ? 'error' : ''}`}
                                maxLength="1"
                                {...register(`otp${index}`, {
                                  required: "These fields are required",
                                  // Add more validation rules if needed
                                })}
                                onChange={(e) => {
                                  handleChange(index, e.target.value);
                                  setValue(`otp${index}`, e.target.value);
                                }}
                                ref={inputRefs[index]}
                              />
                            ))}
                          </div>
                          {errors.otp0 && <p className="error-message">{errors.otp0.message}</p>}
                          <p className="timer-text">Time left: {Math.floor(countdown / 60)}:{countdown % 60}</p>
                          <button type="submit" className="btn mt-4" disabled={countdown === 0}>Done!</button>
                          <p
                            className="mb-0 mt-4 text-center"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Link to="/forget"><ArrowBackIcon />Back</Link>
                            <Link to="/forget">Re-Generate Otp</Link>
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

export default OtpScreen;
