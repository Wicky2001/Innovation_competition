import "./Desktop.css";
import "./global.css";
import ChatHistory from "../ChatHistory";
import { handleSubmit } from "../../functions/fileUpload";

import UploadForm from "../UploadForm";
import { useState } from "react";
// import Chat from "C:UsersWickyDocumentsGitHubInnovation_competition\frontendsrcCoponentsChat.jsx";

const Desktop = ({ clientId, processComplete }) => {
  const [chat, chatList] = useState([]);
  return (
    <>
      <UploadForm clientId={clientId} handleSubmit={handleSubmit} />
      <ChatHistory />
    </>
  );
};

export default Desktop;
