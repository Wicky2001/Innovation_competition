import React, { useEffect } from "react";
import socket from "../functions/socket"; // Import the shared socket instance
import downloadZipFile from "../functions/handleDownload";
import { BsFileEarmarkZip } from "react-icons/bs";
function ChatHistory({ clientId, historyData, setHistoryData }) {
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
    <div
      className="tableContainer"
      style={{ marginBottom: "210px", paddingTop: "30px" }}
    >
      <table
        className="table table-dark"
        style={{ padding: 0, backgroundColor: "rgb(28, 28, 28)" }}
      >
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
                    {console.log("Received zip file path:", data)}
                  </p>
                </div>
                <div className="col button-row-column">
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    onClick={() => {
                      downloadZipFile(data.zipFilePath, clientId);
                    }}
                  >
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
