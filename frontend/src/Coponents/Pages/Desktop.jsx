import "./Desktop.css";
import "./global.css";
import ChatHistory from "../ChatHistory";
import { handleSubmit } from "../../functions/fileUpload";
import NavBar from "../NavBar";
import logo from '../Assects/logo.png'
import socket from "../../functions/socket"; // Import the shared socket instance


import UploadForm from "../UploadForm";

import "./Desktop.css";
import SideBar from "../SideBar";
import { useState,useEffect } from "react";

const Desktop = ({ clientId }) => {

  const [sideBarVisible,setSideBarVisible]=useState(false)
  const [historyData, setHistoryData] = useState([]);


 const  handleSideBar=()=>{
    console.log("clicked");
    setSideBarVisible(!sideBarVisible);
    console.log(historyData)
  }
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
        const updatedHistoryData = [...prevHistoryData, data];
        return removeDuplicates(updatedHistoryData, "chatId"); // Adjust the key as per your data structure
      });
    };

    // Listen for 'data' event from server
    socket.on("data", handleData);

    // Clean up on unmount
    return () => {
      socket.off("data", handleData);
    };
  }, []);

  return (
    <div className={(sideBarVisible)? "app-container":""}>
      <div className="sideBar" >
        <SideBar handleSideBar={handleSideBar} sideBarVisible={sideBarVisible}/>
      </div>
      <div className="content">
            <div className="navBar">
                <NavBar handleSideBar={handleSideBar} sideBarVisible={sideBarVisible}/>
            </div>
            <div className="main-content">
            {historyData.length > 0 ? (
                <ChatHistory clientId={clientId} historyData={historyData} />
              ) : (
                <div className="welcomeContainer">
                    <img src={logo} alt="Logo" className="logo" />
                    <div className="welcome">
                      <h1>Welcome to Your  Grading Assistant</h1>
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
