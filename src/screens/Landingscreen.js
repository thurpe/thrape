import React from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 2000,
});

export default function Landingscreen() {
  return (
    <div>
      <div
        className="row landing justify-content-center"
        style={{ borderRight: "10px solid white" }}
      >
        <div className="col-md-9 my-auto text-center">
          <h2
            style={{ color: "whitesmoke", fontSize: "120px" }}
            data-aos="zoom-in"
          >
            Thrape
          </h2>
          <h6
            style={{ color: "whitesmoke" }}
            className="p-3"
            data-aos="zoom-out"
          >
            "We believe comfort is a joke! Welcome to Heaven"
          </h6>
          <Link to="/home">
            <button className="btn btn-light btn-lg">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
