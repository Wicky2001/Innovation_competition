import "./container.css";
import pdf from "../Assects/pdf.png"

const Container = () => {
  return (
    <div className="container">
      <div className="value-row-three-wrapper">
        <div className="value-row-three">
          <div className="value-row-one">
            <img
              className="icons8-import-pdf-50-3-27"
              loading="lazy"
              alt=""
              src={pdf}
            />
          </div>
          <div className="answer-pdf1">Answer PDF</div>
        </div>
      </div>
      <div className="container1" />
      <div className="export-p-d-f-caption-wrapper">
        <div className="export-p-d-f-caption">
          <div className="value-row-two">
            <img
              className="icons8-import-pdf-50-3-28"
              loading="lazy"
              alt=""
              src={pdf}
            />
          </div>
          <div className="marking-scheme-pdf3">Marking Scheme PDF</div>
        </div>
      </div>
    </div>
  );
};

export default Container;
