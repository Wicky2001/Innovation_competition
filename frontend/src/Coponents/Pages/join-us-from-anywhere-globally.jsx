import "./join-us-from-anywhere-globally.css";
import pdf from "../Assects/pdf.png"
import camera from '../Assects/camera.png';
import upload from '../Assects/upload.png';

const JoinUsFromAnywhereGlobally = () => {
  return (
    <footer className="join-us-from-anywhere-globally">
      <div className="join-us-from-anywhere-globally-inner">
        <div className="frame-parent23">
          <div className="frame-wrapper10">
            <div className="icons8-import-pdf-50-3-2-group">
              <img
                className="icons8-import-pdf-50-3-29"
                loading="lazy"
                alt=""
                src={pdf}
              />
              <div className="click-to-upload-or-drop-answer-wrapper1">
                <div className="click-to-upload-container5">
                  <p className="click-to-upload5">{`Click to Upload or Drop `}</p>
                  <p className="answer-pdf-here3">Answer PDF here ......</p>
                </div>
              </div>
            </div>
          </div>
          <div className="welcome-to-digital-world">
            <div className="icons8-camera-50-1-wrapper3">
              <img
                className="icons8-camera-50-16"
                alt=""
                src={camera}
              />
            </div>
            <input
              className="enter-your-answer3"
              placeholder="Enter Your Answer ..."
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="our-work-culture" />
      <div className="join-us-from-anywhere-globally-child">
        <div className="click-to-upload-m-s-btn-parent">
          <div className="click-to-upload-m-s-btn">
            <div className="icons8-import-pdf-50-3-2-container">
              <img
                className="icons8-import-pdf-50-3-210"
                loading="lazy"
                alt=""
                src={pdf}
              />
              <div className="click-to-upload-or-drop-markin-wrapper1">
                <div className="click-to-upload-container6">
                  <p className="click-to-upload6">{`Click to Upload or Drop `}</p>
                  <p className="marking-scheme-pdf4">
                    Marking Scheme PDF here .....
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mark-scheme-upload">
            <div className="reach-out-to-us">
              <div className="marking-scheme-input">
                <img
                  className="icons8-camera-50-17"
                  alt=""
                  src={camera}
                />
              </div>
              <input
                className="send-button3"
                placeholder="Type Marking Scheme Answer ..."
                type="text"
              />
              <div className="icons8-send-30-1-13" />
            </div>
            <div className="click-to-upload7">
              <img
                className="icons8-upload-30-13"
                loading="lazy"
                alt=""
                src={upload}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default JoinUsFromAnywhereGlobally;
