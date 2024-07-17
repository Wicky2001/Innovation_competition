import React, { useEffect, useState, useRef, useCallback } from 'react';
import style from './SideBar.module.css';
import logo from './Assects/logo.png';
import { BsLayoutSidebar } from "react-icons/bs";
import fetchPrevChats from '../functions/fetchPrevChats';
import PrevChat from './PrevChat';

const SideBar = ({ handleSideBar, sideBarVisible }) => {
  const [prevChats, setPrevChats] = useState([]);
  const sideBarRef = useRef(null);

  const deletePrevChat = (chatToDelete) => {
    setPrevChats(prevChats.filter(chat => chat !== chatToDelete));
  };

  const downloadPrevChat = (chatName) => {
    
    console.log(`Downloading chat: ${chatName}`);
  };

  useEffect(() => {
    const chats = fetchPrevChats();
    setPrevChats(chats);
  }, []);

  const handleClickOutside = useCallback((event) => {
    
    console.log(sideBarRef.current.contains)
    console.log(event.target)
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      handleSideBar(false);
    }
  }, [handleSideBar]);

  useEffect(() => {
    if (sideBarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sideBarVisible]);

  return (
    <div ref={sideBarRef} className={`${style.sideBar} ${sideBarVisible ? style.visible : ''}`}>
      <div className={style.topArea}>
        <button onClick={() => handleSideBar(false)}>
          <BsLayoutSidebar className={style.sideBarIcon} />
        </button>
      </div>
      <div className={style.company}>
        <span className={style.companyName}>Grading.AI</span>
        <div className={style.companyLogo}><img src={logo} alt="Logo" /></div>
      </div>
      <div className={style.previousChats}>
        {prevChats.map((chat, index) => (
          <PrevChat
            key={index}
            chatName={chat}
            downloadPrevChat={downloadPrevChat}
            deletePrevChat={deletePrevChat}
          />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
