import "./Desktop.css";
import "./global.css";
import Chat from "../Chat.jsx";
import { handleSubmit } from "../../functions/fileUpload";

import UploadForm from "../UploadForm";


const Desktop = ({ clientId, processComplete, }) => {
  return (
    <>
      <Chat i={1} />
      <UploadForm clientId={clientId} handleSubmit={handleSubmit}/>
    </>
  );
};

export default Desktop;
