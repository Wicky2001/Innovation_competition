import React from 'react'
import "./Desktop.css";
import "./global.css";
import FrameComponent from './frame-component'; 
import logo from '../Assects/logo.png';
import camera from '../Assects/camera.png';
import upload from '../Assects/upload.png';
import DownloadButton from "./DownloadButton"

import {handleSubmit} from "../../functions/fileUpload"
// import { handleDownload } from '../../functions/handleDownload';




const Desktop = ({clientId,processComplete}) => {
console.log("desktop"+clientId);
  return (
    <div className="desktop">
      <div className="desktop-inner">
        <div className="frame-parent">
          <div className="icon-1-parent">
            <img
              className="icon-1"
              loading="lazy"
              alt=""
              src={logo}
            />
            <h1 className="gradingai">Grading.AI</h1>
          </div>
          <div className="your-personal-marking-assisten-wrapper">
            <div className="your-personal-marking">
              Your personal marking assistence
            </div>
          </div>
        </div>
      </div>
      <div id="message">
        
      </div>


      <section className="frame-group">
        <div className="frame-wrapper">
          <div className="frame-container">
            <form method='post'>
                <label>
                  <input type="file" id="answerSheet" style={{ display: "none" }} multiple/>
                  <FrameComponent answerPDFHere="Answer PDF here ......" />
                </label>
                  
            </form>
            
            <div className="frame-div">

              <div className="icons8-camera-50-1-wrapper">
                <img
                  className="icons8-camera-50-1"
                  alt=""
                  src={camera}
                />
              </div>

              <input
                className="enter-your-answer"
                placeholder="Enter Your Answer ..."
                type="text"
              />
            </div>
          </div>
        </div>
        {/* <div className="frame-child" /> */}
        <div className="frame-wrapper1">
            <div className="frame-parent1">
            <form method='post' >
                  <label>
                    <input type="file" id='markingScheme' style={{ display: "none" }} multiple/>
                    <FrameComponent
                      answerPDFHere="Marking Scheme PDF here ....."
                      propWidth="462px"
                      propPadding="0px 57px"
                      propWidth1="unset"
                      propFlex="1"
                      propMinWidth="181px"
                    />
                  </label>
                    
            </form>
            <div className="frame-parent2">
            <div className="frame-parent3">

            
                <div className="icons8-camera-50-1-container">
                  <img
                    className="icons8-camera-50-11"
                    alt=""
                    src={camera}
                  />
                </div>
                
              <input
                className="type-marking-scheme"
                placeholder="Type Marking Scheme Answer ..."
                type="text"
              />
              <div className="icons8-send-30-1-1" />
              </div>
              <button onClick={(event) => handleSubmit(event, clientId)}>
                <div className="icons8-upload-30-1-wrapper">
                    <img
                        className="icons8-upload-30-1"
                        loading="lazy"
                        alt=""
                        src={upload}
                      />
                </div>
              </button>
                    
            </div>
            {(processComplete)
            ?
                 <DownloadButton processComplete={processComplete}/>
                
 
            :   " "}
            
            
          

          </div>
        </div>
      </section>
    </div>
  );
};

export default Desktop;
