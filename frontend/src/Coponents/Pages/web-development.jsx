import "./web-development.css";
import pdfG from "../Assects/pdf-G.png";

const WebDevelopment = () => {
  return (
    <div className="web-development">
      <div className="empty-label-wrapper">
        <div className="empty-label">
          <img
            className="icons8-export-pdf-50-11"
            loading="lazy"
            alt=""
            src={pdfG}
          />
          <div className="upload-button-p-d-f">
            <div className="camera-icon3">
              <div className="feedback-for-your3">
                Feedback for your answer.......
              </div>
              <div className="send-button2">
                <div className="overall-this-is3">
                  Overall, this is a solid response that demonstrates a good
                  understanding of the main causes of climate change. To
                  improve, consider expanding on each cause with additional
                  examples or details to provide a more comprehensive answer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grade-container">
        <div className="grade3">Grade</div>
        <div className="we-foster-innovation-and-trans-wrapper">
          <div className="we-foster-innovation-and-trans" />
        </div>
        <div className="continuous-learning-wrapper">
          <div className="continuous-learning">0.6</div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
