import "./global.css";
import ChatHistory from "../ChatHistory";
import { handleSubmit } from "../../functions/fileUpload";
import NavBar from "../NavBar";
import logo from "../Assects/logo.png";

import UploadForm from "../UploadForm";

import "./Desktop.css";
import SideBar from "../SideBar";
import { useState } from "react";
import "./Desktop.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Desktop = ({ clientId }) => {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handleSideBar = () => {
    console.log("clicked");
    setSideBarVisible(!sideBarVisible);
  };

  return (
    <div className={sideBarVisible ? "app-container" : ""}>
      <div className="sideBar">
        <SideBar
          handleSideBar={handleSideBar}
          sideBarVisible={sideBarVisible}
        />
      </div>
      <div className="content">
        <div className="navBar">
          <NavBar
            handleSideBar={handleSideBar}
            sideBarVisible={sideBarVisible}
          />
        </div>
        <div className="main-content">
          {historyData.length > 0 ? (
            <ChatHistory
              clientId={clientId}
              historyData={historyData}
              setHistoryData={setHistoryData}
            />
          ) : (
            <div className="welcomeContainer">
              <img src={logo} alt="Logo" className="logo" />
              <div className="welcome">
                <h1>Welcome to Your Grading Assistant</h1>
              </div>
            </div>
          )}
        </div>
        <UploadForm clientId={clientId} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Desktop;
