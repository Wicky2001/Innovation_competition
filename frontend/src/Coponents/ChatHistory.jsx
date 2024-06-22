import React, { useEffect, useState } from "react";
import socket from "../functions/socket"; // Import the shared socket instance
// import { PiFileZipDuotone } from "react-icons/pi";
import { BsFileEarmarkZip } from "react-icons/bs";
function ChatHistory() {
  const [historyData, setHistoryData] = useState([]);

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

      console.log("Received zip file path:", data.filePath);
    };

    // Listen for 'data' event from server
    socket.on("data", handleData);

    // Clean up on unmount
    return () => {
      socket.off("data", handleData);
    };
  }, []);
  return (
    <div className="tableContainer">
      <table className="table table-dark" style={{ padding: 0 }}>
        <tbody>
          {historyData.map((data, key) => (
            <tr id={key}>
              <div
                className="row"
                style={{
                  padding: 0,
                  paddingTop: "10px",
                  borderRadius: "10px",
                  marginTop: "7px",
                }}
              >
                <div className="col zip-row-column">
                  <BsFileEarmarkZip color="gray" size={30} />
                  <p className="result-label">
                    Result<sup>{data.chatId}</sup>
                  </p>
                </div>
                <div className="col button-row-column">
                  <button type="button" class="btn btn-outline-success">
                    Download
                  </button>
                </div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChatHistory;
