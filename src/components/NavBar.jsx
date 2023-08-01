import React, { useState, useEffect } from "react";
import  secureLocalStorage  from  "react-secure-storage";
import GALogo from "../svg/logo.svg";
import { SlMenu } from "react-icons/sl";
import { TfiClose } from "react-icons/tfi";

const NavBar = ({ handleActiveTabChange, signedOn, setSignedOn }) => {
  const [toggleMenu, setToggleMenu] = useState(false);


  const toggleMenuOnClick = (e) => {
    setToggleMenu(!toggleMenu);
  };
  const menuBarTabChange = (tab) => {
    handleActiveTabChange(tab);
    setToggleMenu(!toggleMenu);
  };

  const logoutOnClick = (e) =>{
    secureLocalStorage.clear();
    setSignedOn(false);
    window.location.reload(true);
  }

  return (
    <div className="Navbar flex justify-between md:flex-row  w-full h-[78px] py-3 px-[10%] bg-black text-my-white z-[999] fixed top-0">
      <div className="logo pr-[2.8rem]">
        <a href="" className="w-full h-full flex items-center">
          <img
            alt="Game Academy Logo"
            id="GA-logo"
            className="w-12 align-baseline"
            src={GALogo}
          />
        </a>
      </div>
      <div
        className={`w-full absolute left-0 top-[-50vh] bg-black h-[50vh] md:static md:h-auto md:top-0 md:bg-transparent z-[-2] text-transparent transition-[color] ease-in duration-[1s] md:text-my-white  ${
          toggleMenu
            ? "top-[78px]  nav-slideIn "
            : "nav-slideOut ease-out duration-[200ms]"
        } text-transparent`}
      >
        <ul className="nav-links flex flex-col justify-center px-[10%] md:px-0 md:flex-row md:items-center w-full h-full gap-[10%] text-lg ">
          <li>
            <button
              className="tabLink"
              onClick={() => menuBarTabChange("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="tabLink"
              onClick={() => menuBarTabChange("shop")}
            >
              Shop
            </button>
          </li>
          <li>
            <button className="tabLink" onClick={() => menuBarTabChange("game")}>Game</button>
          </li>
          <li>
            <button
              className="tabLink"
              onClick={() => menuBarTabChange("guest")}
            >
              Guest Book
            </button>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-end gap-[5%] w-full md:w-auto">
        <button
          className={`${signedOn ? "hidden" : "block"} h-full px-[2.8rem] rounded-[1.8rem] border-my-white-600 bg-my-white border text-my-black text-lg md:whitespace-nowrap`}
          onClick={() => menuBarTabChange("login")}
        >
          Sign in
        </button>
        <button
          className={`${signedOn ? "block" : "hidden"} h-full px-[2.8rem] rounded-[1.8rem] border-my-white-600 bg-my-white border text-my-black text-lg md:whitespace-nowrap`}
          onClick={() => logoutOnClick()}
        >
          Logout
        </button>
        {!toggleMenu ? (
          <SlMenu
            className="md:hidden cursor-pointer"
            color="white"
            size={"20px"}
            onClick={toggleMenuOnClick}
          />
        ) : (
          <TfiClose
            className="md:hidden cursor-pointer"
            color="white"
            size={"20px"}
            onClick={toggleMenuOnClick}
          />
        )}
      </div>
      {/* <div class="burger">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div> */}
    </div>
  );
};

export default NavBar;
