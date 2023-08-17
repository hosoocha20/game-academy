import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import GALogo from "../svg/logo.svg";
import { SlMenu } from "react-icons/sl";
import { TfiClose } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const NavBar = ({ handleActiveTabChange, signedOn, setSignedOn }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [uname, setUname] = useState(secureLocalStorage.getItem("uname"));

  const navigate = useNavigate();
  const viewNavigate = (newRoute) => {
    // Navigate to the new route
    if (!document.startViewTransition) {
      return navigate(newRoute);
    } else {
      return document.startViewTransition(() => {
        navigate(newRoute);
      });
    }
  };

  const toggleMenuOnClick = (e) => {
    setToggleMenu(!toggleMenu);
  };
  const menuBarTabChange = (tab) => {
    handleActiveTabChange(tab);
    setToggleMenu(!toggleMenu);
  };

  const logoutOnClick = (e) => {
    setToggleDropdown(false);
    secureLocalStorage.clear();
    setSignedOn(false);
    window.location.reload(true);
  };

  useEffect(() => {
    setUname(secureLocalStorage.getItem("uname"));
  }, [signedOn]);

  return (
    <div className="Navbar flex justify-between md:flex-row  w-full h-[4.875rem] py-3 px-[10%] bg-black text-my-white z-[999] fixed top-0">
      <div className="logo pr-[2.8rem]">
        <a href="" className="w-full h-full flex items-center">
          <img
            alt="Game Academy Logo"
            id="GA-logo"
            className="w-12 align-baseline min-w-[30px]"
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
              onClick={() => viewNavigate("/")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="tabLink"
              onClick={() => viewNavigate("shop")}
            >
              Shop
            </button>
          </li>
          <li>
            <button
              className="tabLink"
              onClick={() => viewNavigate("game")}
            >
              Game
            </button>
          </li>
          <li>
            <button
              className="tabLink"
              onClick={() => viewNavigate("guestbook")}
            >
              Guest Book
            </button>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-end gap-[5%] w-full md:w-auto relative">
        <button
          className={`${
            signedOn ? "hidden" : "block"
          } h-full px-[2.8rem] rounded-[1.8rem] border-my-white-600 bg-my-white border text-my-black text-lg md:whitespace-nowrap`}
          onClick={() => viewNavigate("login")}
        >
          Sign in
        </button>
        <button
          className={`${
            signedOn ? "block" : "hidden"
          } h-full md:px-[1.5rem] px-[0.8rem] rounded-[1.8rem] border-my-white-600 bg-my-white border text-my-black text-lg md:whitespace-nowrap flex items-center md:gap-[0.9rem] gap-[0.4rem] `}
          onClick={(e) => setToggleDropdown(!toggleDropdown)}
        >
          <FaUser />
          <p className="md:text-[1rem] text-[0.9rem]">{uname}</p>
          <IoIosArrowDown />
        </button>
        {toggleDropdown && (
          <ul className="absolute border top-[105%] left-0 w-full h-full px-[0.6rem] py-[0.4rem] rounded bg-white text-my-black flex items-center">
            <li
              className="flex gap-[1rem] items-center cursor-pointer hover:bg-[#eeeeee] w-full h-full px-[2rem] rounded"
              onClick={() => logoutOnClick()}
            >
              <MdLogout />
              Logout
            </li>
          </ul>
        )}

        {!toggleMenu ? (
          <SlMenu
            className="md:hidden cursor-pointer min-w-[20px]"
            color="white"
            size={"20px"}
            onClick={toggleMenuOnClick}
          />
        ) : (
          <TfiClose
            className="md:hidden cursor-pointer min-w-[20px]"
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
