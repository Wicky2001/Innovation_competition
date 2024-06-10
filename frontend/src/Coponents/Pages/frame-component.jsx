import { useMemo } from "react";
import "./frame-component.css";
import pdf from '../Assects/pdf.png';

const FrameComponent = ({
  answerPDFHere,
  propWidth,
  propPadding,
  propWidth1,
  propFlex,
  propMinWidth,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      width: propWidth,
      padding: propPadding,
    };
  }, [propWidth, propPadding]);

  const clicktoUploadOrDropAnswerStyle = useMemo(() => {
    return {
      width: propWidth1,
      flex: propFlex,
    };
  }, [propWidth1, propFlex]);

  const frameDiv1Style = useMemo(() => {
    return {
      minWidth: propMinWidth,
    };
  }, [propMinWidth]);

  return (
    <div
      className="clickto-upload-or-drop-answer-wrapper"
      style={frameDivStyle}
    >
      <div
        className="clickto-upload-or-drop-answer"
        style={clicktoUploadOrDropAnswerStyle}
      >
        <img
          className="icons8-import-pdf-50-3-2"
          loading="lazy"
          alt=""
          src={pdf}
        />
        <div
          className="click-to-upload-or-drop-answer-wrapper"
          style={frameDiv1Style}
        >
          <div className="click-to-upload-container">
            <p className="click-to-upload">{`Click to Upload or Drop `}</p>
            <p className="answer-pdf-here">{answerPDFHere}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;
