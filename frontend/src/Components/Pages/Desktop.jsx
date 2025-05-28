import "./global.css";
import ChatHistory from "../ChatHistory";
import { handleSubmit } from "../../functions/fileUpload";
import NavBar from "../NavBar";
import logo from "../Assects/logo.png";
import socket from "../../functions/socket"; // Import the shared socket instance

import UploadForm from "../UploadForm";

import "./Desktop.css";
import SideBar from "../SideBar";
import { useState, useEffect } from "react";
import "./Desktop.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Desktop = ({ clientId }) => {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handleSideBar = () => {
    console.log("clicked");
    setSideBarVisible(!sideBarVisible);
  };

  function removeDuplicates(array, key) {
    const unique = new Map();
    array.forEach((item) => {
      if (!unique.has(item[key])) {
        unique.set(item[key], item);
      }
    });
    return Array.from(unique.values());
  }

  useEffect(() => {
    // Handler function for data event
    const handleData = (data) => {
      setHistoryData((prevHistoryData) => {
        console.log("received data from front end =>" + data);
        const updatedHistoryData = [...prevHistoryData, data];
        return removeDuplicates(updatedHistoryData, "chatId"); // Adjust the key as per your data structure
      });
    };

    // Listen for 'data' event from server
    socket.on("PDFData", handleData);
    socket.on("TextData", handleData);

    // Clean up on unmount
    return () => {
      socket.off("PDFData", handleData);
      socket.off("TextData", handleData);
    };
  }, []);

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
        <div className="main-content container" style={{ padding: "0px" }}>
          {historyData.length > 0 ? (
            <ChatHistory
              clientId={clientId}
              historyData={historyData}
              setHistoryData={setHistoryData}
            />
          ) : (
            <div className="welcomeContainer">
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>

              <div className="welcome">
                <h1 className="companyName">Grading.AI</h1>
                <h2 className="welcomeText">
                  Your personal marking assistence
                </h2>
              </div>
            </div>
          )}
        </div>
        <div className="formContainer">
          <UploadForm clientId={clientId} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Desktop;
