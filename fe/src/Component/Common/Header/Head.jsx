import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../../assets/logo.png";

export default function Head() {
  return (
    <div className="head">
      <div className="flexSB">
        <div className="logo">
          <Link to="/">
            <img style={{ height: "90px", width: "90px" }} src={logo} alt=""/>
          </Link>
          <span>ONLINE EDUCATION & LEARNING</span>
        </div>

        <div className="social">
          <a
            href="https://www.facebook.com/victoryu.toeic"
            target="_blank"
            className="fab fa-facebook-f icon"
          ></a>
          <i className="fab fa-instagram icon"></i>
          <i className="fab fa-twitter icon"></i>
          <i className="fab fa-youtube icon"></i>
        </div>
      </div>
    </div>
  );
}
