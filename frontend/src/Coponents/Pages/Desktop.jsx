import "./Desktop.css";
import "./global.css";
import ChatHistory from "../ChatHistory";
import { handleSubmit } from "../../functions/fileUpload";

import UploadForm from "../UploadForm";

import "./Desktop.css";
// import Chat from "C:UsersWickyDocumentsGitHubInnovation_competition\frontendsrcCoponentsChat.jsx";

const Desktop = ({ clientId }) => {
  return (
    <div className="app-container">
      <div className="main-content">
        <ChatHistory clientId={clientId} />
      </div>
      <UploadForm clientId={clientId} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Desktop;
