import React from "react";
import style from "./TextChat.module.css";

const TextChat = ({ textData }) => {
  const { feedback, marks, studentAnswer } = textData;
  return (
    <>
      <tr className={style.row}>
        <td>
          <h2 className={`${style.marksTitle} `}>
            Marks:<span className={style.marks}>{marks}</span>
          </h2>
          <p className={style.feedback}>
            <h3 className={style.feedbackTitle}>feedback</h3>
            {feedback}
          </p>
          <p className={style.studentAnswer}>
            <h3 className={style.studentAnswerTitle}>Student Answer</h3>
            {studentAnswer}
          </p>
        </td>
      </tr>
    </>
  );
};

export default TextChat;
