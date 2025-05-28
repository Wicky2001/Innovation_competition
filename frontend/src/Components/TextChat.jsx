import React from "react";
import style from "./TextChat.module.css";

const TextChat = ({ textData }) => {
  const { feedback, marks, studentAnswer } = textData;
  return (
    <>
      <tr style={{ backgroundColor: "rgb(28, 28, 28)" }}>
        <td
          style={{
            borderBottomWidth: "0px",
            borderRadius: "10px",
            backgroundColor: "rgb(28, 28, 28)",
          }}
        >
          <h9 className={`${style.marksTitle} `}>
            Marks:<span className={style.marks}>{marks}</span>
          </h9>

          <div style={{ marginBottom: "2px" }}>
            <h9 className={style.feedbackTitle}>feedback</h9>
            <p className={style.feedback}>{feedback}</p>
          </div>

          <div style={{ marginBottom: "2px" }}>
            <h9 className={style.studentAnswerTitle}>Student Answer</h9>
            <p className={style.studentAnswer}>{studentAnswer}</p>
          </div>
        </td>
      </tr>
    </>
  );
};

export default TextChat;
