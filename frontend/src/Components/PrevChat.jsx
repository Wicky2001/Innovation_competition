import React from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import style from './PrevChat.module.css';

const PrevChat = ({ chatName, deletePrevChat, downloadPrevChat }) => {
  return (
    <div className={style.chatItem}>
      <div className={style.chatName}>
        <button onClick={() => downloadPrevChat(chatName)}>
          {chatName}
        </button>
      </div>
      <div className={style.delChat}>
        <button onClick={() => deletePrevChat(chatName)}>
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default PrevChat;
