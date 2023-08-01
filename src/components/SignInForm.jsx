import React, { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { BsPerson } from "react-icons/bs";
import { RxLockClosed } from "react-icons/rx";

const SignInForm = ({
  handleActiveTabChange,
  mobileLinkClicked,
  setMobileLinkClicked,
  setSignedOn,
}) => {
  const [signInResponseMsg, setSignInResponseMsg] = useState("");
  const SecureLocalStorage = (e) => {};

  const signInSubmit = (e) => {
    e.preventDefault();
    let uname = document.getElementById("signIn-userName").value;
    let pw = document.getElementById("signIn-pw").value;
    fetch("https://cws.auckland.ac.nz/gas/api/VersionA", {
      headers: {
        Authorization: "Basic " + btoa(`${uname}:${pw}`),
        Accept: "text/plain",
      },
    }).then(function (response) {
      if (response.ok) {
        setSignInResponseMsg("");
        secureLocalStorage.setItem("uname", uname);
        secureLocalStorage.setItem("pw", pw);
        secureLocalStorage.setItem("state", true);
        setSignedOn(true);
        handleActiveTabChange("home");
        uname = "";
        pw = "";

        // var loginBtnValue = document.getElementById('login-nav-btn').value;
        // //alert(loginBtnValue);
        // if (loginBtnValue == "login"){
        //   document.getElementById('loginNavText').textContent = "Logout";
        //   document.getElementById('login-nav-btn').value = "logout";
        //   document.getElementById("defaultOpen").click();

        return response.text();
      } else {
        setSignInResponseMsg("Incorrect username or password");
      }
    });
  };
  return (
    <div className="h-full w-full flex flex-col gap-[1.8rem] md:gap-[4rem] items-center md:justify-normal justify-evenly pt-[78px]">
      <h1 className="text-[2.4rem] font-semibold text-center pt-[17%] md:px-[5%] px-[10%] ">
        Sign in to the <span className="whitespace-nowrap">Game Academy</span>
      </h1>
      <form
        className="relative flex flex-col gap-[1.6rem] md:gap-[1.2rem] w-[70%] md:w-[45%] pt-[8%] text-[1.2rem] md:text-[1rem]"
        onSubmit={signInSubmit}
      >
        {signInResponseMsg && (
          <li className="text-error-red-dark absolute top-0 list-disc list-inside border-error-red-dark bg-error-red-light w-full py-[2%] pl-[6%] rounded invalidForm">
            {signInResponseMsg}
          </li>
        )}

        <label className="relative">
          <input
            className="form-name border border-[#D0D0D0] focus:outline-none focus:border-[#696969] rounded w-full pl-[13%] pr-[4%] py-[2%] "
            type="text"
            id="signIn-userName"
            placeholder="Username"
            autoComplete="new-password"
            required
          />
          <span className="label-name absolute top-0 flex items-center pl-[3%]  pt-[3%]  ">
            <BsPerson />
          </span>
        </label>
        <label className="relative pb-[16%]">
          <input
            className="form-pw border border-[#D0D0D0] focus:outline-none focus:border-[#696969] rounded w-full pl-[13%] pr-[4%] py-[2%] "
            type="password"
            id="signIn-pw"
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <span className="label-pw absolute top-0 flex items-center pl-[3%]  pt-[3%]  ">
            <RxLockClosed />
          </span>
        </label>

        <button className="border rounded-[1.5rem] w-full  py-[0.7rem] text-white text-[1.2rem] md:text-[1rem] tracking-widest bg-my-black hover:opacity-95">
          SIGN IN
        </button>
      </form>

      <p className="md:hidden pb-[10%]">
        Dont have an account?{" "}
        <span
          className="text-[#0041c2]"
          onClick={(e) => {
            setMobileLinkClicked(!mobileLinkClicked);
          }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default SignInForm;
