import React from "react";
import downloadZipFile from "../functions/handleDownload";
import ChatHistoryFilePreview from "./ChatHistoryFilePreview";
import TextChat from "./TextChat";

function ChatHistory({ clientId, historyData }) {
  console.log(historyData);

  return (
    <div className="tableContainer" style={{ paddingTop: "0px" }}>
      <table
        className="table table-dark"
        style={{
          padding: 0,
          backgroundColor: "rgb(28, 28, 28)",
          borderCollapse: "separate", // Set border collapse to separate
          borderSpacing: "0 20px", // Vertical spacing between rows
        }}
      >
        <tbody>
          {historyData.map((data, key) => (
            <React.Fragment key={key}>
              {data.dataType === "PDF" ? (
                <ChatHistoryFilePreview
                  downloadZipFile={downloadZipFile}
                  data={data}
                  clientId={clientId}
                />
              ) : data.dataType === "Text" ? (
                <TextChat textData={data.textData} />
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChatHistory;
