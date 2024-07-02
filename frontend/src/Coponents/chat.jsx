import React from "react";
import { FaFileZipper } from "react-icons/fa6";
import styles from "./chat.module.css" 

function Chat({i}) {
  return (
    <>
    <div className={styles.chatCard}>
    <p className={styles.title}>Chat No {i}</p>
    <FaFileZipper className={styles.icon}/>
    </div>
    </>
  );
}

export default Chat;
