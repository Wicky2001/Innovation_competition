import "./Desktop.css";
import "./global.css";

import { handleSubmit } from "../../functions/fileUpload";

import UploadForm from "../UploadForm";

const Desktop = ({ clientId, processComplete }) => {
  return (
    <>
      <UploadForm clientId={clientId} handleSubmit={handleSubmit}></UploadForm>
    </>
  );
};

export default Desktop;
