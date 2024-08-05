import React from "react";
import { BsFileEarmarkZip } from "react-icons/bs";
function ChatHistoryFilePreview({ downloadZipFile, data, clientId, key }) {
  return (
    <tr id={key}>
      <div
        className="row"
        style={{
          padding: "0px",
          paddingTop: "10px",
          borderRadius: "10px",
          marginTop: "7px",
          marginLeft: "0px",

          width: "100%",
          backgroundColor: "rgb(28, 28, 28)",
          border: "green solid 0.5px",
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
            class="btn btn-outline-success "
            onClick={() => {
              downloadZipFile(data.zipFilePath, clientId);
            }}
          >
            Download
          </button>
        </div>
      </div>
    </tr>
  );
}

export default ChatHistoryFilePreview;
