import React from "react";
import "./Loader.css";

function Loader({ fullLoad }) {
  return (
    <div className="loader-wrapper">
      <div className={`loader ${fullLoad ? "full-loader" : ""}`}></div>
    </div>
  );
}

export default Loader;
