import React, { useEffect, useState } from "react";
import { FaRegFilePdf, FaFileCircleCheck } from "react-icons/fa6";
import { TbCloudCancel } from "react-icons/tb";
import { GrUploadOption } from "react-icons/gr";
import "./UploadForm.css";
import socket from "../functions/socket";





function UploadForm({ clientId, handleSubmit }) {
  const [markingSchemeFileSelected, setMarkingSchemeFileSelected] =
    useState(false);
  const [answerSheetFileSelected, setAnswerSheetFileSelected] = useState(false);
  const [disableTextInput, setDisableTextInput] = useState(false);
  const [disableFileInputs, setDisableFileInputs] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    socket.on("data", (data) => {
      console.log("Zipping done => ", data.processComplete);
      setProcessing(!data.processComplete);
    });
  }, []);

  const changeFileUploadLogo = (fileSelected) => {
    if (fileSelected) {
      return <FaFileCircleCheck color="gray" />;
    } else if (disableFileInputs) {
      return <TbCloudCancel color="gray" />;
    } else {
      return <FaRegFilePdf color="gray" />;
    }
  };

  return (
    <>
      <div className="container upload-container">
        <div className="row justify-content-center">
          <form method="POST">
            <div className="row">
              <div className="col">
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    className="file-input"
                    id="markingScheme"
                    disabled={disableFileInputs}
                    style={{ display: "none" }}
                    onChange={(event) => {
                      if (event.target.files.length > 0) {
                        setMarkingSchemeFileSelected(true);
                        setDisableTextInput(true); // When file is uploaded, disable the text inputs
                      } else {
                        setMarkingSchemeFileSelected(false);
                        setDisableTextInput(false);
                      }
                    }}
                  />
                  <label htmlFor="markingScheme" className="file-label">
                    {changeFileUploadLogo(markingSchemeFileSelected)}
                  </label>
                </div>
                <input
                  type="text"
                  disabled={disableTextInput}
                  className="form-control"
                  id="markingSchemeText"
                  placeholder="Marking Scheme"
                  onChange={(event) => {
                    if (event.target.value.length > 0) {
                      setDisableFileInputs(true);
                    } else {
                      setDisableFileInputs(false);
                    }
                  }}
                />
              </div>
              <div className="col">
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    disabled={disableFileInputs}
                    className="file-input"
                    id="answerSheet"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      if (event.target.files.length > 0) {
                        setAnswerSheetFileSelected(true);
                        setDisableTextInput(true);
                      } else {
                        setAnswerSheetFileSelected(false);
                        setDisableTextInput(false);
                      }
                    }}
                  />
                  <label htmlFor="answerSheet" className="file-label">
                    {changeFileUploadLogo(answerSheetFileSelected)}
                  </label>
                </div>
                <input
                  type="text"
                  disabled={disableTextInput}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Answers"
                  onChange={(event) => {
                    if (event.target.value.length > 0) {
                      setDisableFileInputs(true);
                    } else {
                      setDisableFileInputs(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="upload-button-container">
                {processing ? (
                  <div>
                    <div
                      class="spinner-border text-success spinner_icon"
                      role="status"
                      style={{
                        width: "32px",
                        height: "32px",
                        marginBottom: "2px",
                      }}
                    ></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="upload-button"
                    onClick={(event) => {
                      handleSubmit(event, clientId);
                      setProcessing(true);
                    }}
                    disabled={
                      !markingSchemeFileSelected && !answerSheetFileSelected
                    }
                  >
                    {markingSchemeFileSelected && answerSheetFileSelected ? (
                      <GrUploadOption color="green" size={40} />
                    ) : (
                      <GrUploadOption color="red" size={40} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadForm;
