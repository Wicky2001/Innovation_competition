import React from 'react';
import { BsLayoutSidebar } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import style from './NavBar.module.css';

const NavBar = ({ handleSideBar ,sideBarVisible}) => {
  return (
    <div className={style.navBar}>
      <div className={style.leftNavBar}>
        <button onClick={handleSideBar}>
        <BsLayoutSidebar className={`${style.sideBarIcon} ${sideBarVisible ? style.hideSideBarIcon : ''}`} />

        </button>
        <div className={style.company}>
          <span className={style.companyName}>Grading.AI</span>
        </div>
      </div>
      <div className={style.user}>
        <button>
        <FaRegUser className={style.userIcon} />
        </button>
        
      </div>
    </div>
  );
}

export default NavBar;
