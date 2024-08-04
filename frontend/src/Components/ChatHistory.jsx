import React from "react";
import downloadZipFile from "../functions/handleDownload";
import ChatHistoryFilePreview from "./ChatHistoryFilePreview";

function ChatHistory({ clientId, historyData }) {
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
            <React.Fragment key={key}>
              {data.dataType === "PDF" ? (
                <ChatHistoryFilePreview
                  downloadZipFile={downloadZipFile}
                  data={data}
                  clientId={clientId}
                />
              ) : data.dataType === "Text" ? (
                <tr>
                  <td>
                    <p>{data.textData.feedback}</p>
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChatHistory;
