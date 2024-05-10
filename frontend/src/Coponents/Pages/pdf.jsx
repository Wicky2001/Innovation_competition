import React from 'react'
import "./global.css";
import "./pdf.css"
import Container from "./container"
import WebDevelopment from "./web-development";
import JoinUsFromAnywhereGlobally from "./join-us-from-anywhere-globally";
import logo from "../Assects/logo.png"


const PDF = () => {
  return (
    <div className="pdf">
      <section className="frame-parent6">
        <img
          className="frame-inner"
          loading="lazy"
          alt=""
          src={logo}
        />
        <div className="container-parent">
          <Container />
          <WebDevelopment />
        </div>
      </section>
      <JoinUsFromAnywhereGlobally />
    </div>
  );
};

export default PDF;
