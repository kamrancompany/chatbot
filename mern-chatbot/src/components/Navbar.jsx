import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import logo from '../assets/chatbotImages/bot_images.png'

const Navbar = () => {
  const auth = localStorage.getItem("users");
  const navigate = useNavigate();

  const logout =()=>{
    localStorage.clear();
    navigate("/signin")
  }

  return (
    <>
      <div className="navbar_main_div">
        <img src={logo} style={{height:"50px",width:"50px",borderRadius:"15px"}}/>
      {auth ? (<>
        <Link to="/" className="navbar-links">
          Bard Ai
        </Link>
        <Link to="/auto" className="navbar-links">
          ChatBot
        </Link>
        
          <Link onClick={logout} to="/signin" className="navbar-links">
            Logout
          </Link>
          </>
        ) : (
          <Link to="/signin" className="navbar-links">
            SignIn
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
