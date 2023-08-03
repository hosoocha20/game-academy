import React, { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { RxLockClosed } from "react-icons/rx";

const SignUpForm = ({ mobileLinkClicked, setMobileLinkClicked }) => {
  const [signUpResponseMsg, setSignUpResponseMsg] = useState("");

  const signUpSubmit = (e) => {
    e.preventDefault();
    let uname = document.getElementById("uname-r").value;
    let emailR = document.getElementById("email-r").value;
    let pw = document.getElementById("pw-r").value;
    //fetch post request
    fetch("https://cws.auckland.ac.nz/gas/api/Register", {
      method: "POST",
      body: JSON.stringify({
        username: uname,
        password: pw,
        address: emailR,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        //console.log(data);
        setSignUpResponseMsg(data);
        // alert(data);
      });
  };
  return (
    <div className="w-full h-full flex flex-col items-center pt-[4.875rem] md:gap-[3.5rem] gap-[2rem]">
      <h1 className="text-[2.4rem] font-semibold pt-[17%] md:px-0 px-[8%]">
        Create Account
      </h1>
      <form
        className="flex flex-col gap-[1.2rem] w-[70%] md:w-[45%] text-[1.2rem] md:text-[1rem] md:pt-0 pt-[12%] "
        autocomplete="off"
        onSubmit={signUpSubmit}
      >
        {signUpResponseMsg && (
          <li className="text-error-red-dark list-disc list-inside border-error-red-dark bg-error-red-light w-full py-[2%] pl-[6%] rounded invalidForm">
            {signUpResponseMsg}
          </li>
        )}
        <label className="relative">
          <input
            className=" border border-[#D0D0D0] focus:outline-none focus:border-[#696969] rounded w-full pl-[13%] pr-[4%] py-[2%]"
            type="text"
            id="uname-r"
            placeholder="Username"
            autoComplete="new-password"
          />
          <span className="absolute top-0 flex items-center pl-[3%]  pt-[3%]  ">
            <BsPerson />
          </span>
        </label>
        <label className="relative">
          <input
            className=" border border-[#D0D0D0] focus:outline-none focus:border-[#696969] rounded w-full pl-[13%] pr-[4%] py-[2%]"
            type="text"
            id="email-r"
            placeholder="Email (Optional)"
            autoComplete="new-password"
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            onInvalid={e => e.target.setCustomValidity('Please include an "@" in the email address')}
            onInput={e => e.target.setCustomValidity('')}
          />
          <span className=" absolute top-0 flex items-center pl-[3%]  pt-[3%]  ">
            <HiOutlineMail />
          </span>
        </label>
        <label className="relative pb-[18%]">
          <input
            className=" border border-[#D0D0D0] focus:outline-none focus:border-[#696969] rounded w-full pl-[13%] pr-[4%] py-[2%]"
            type="password"
            id="pw-r"
            placeholder="Password"
            autoComplete="new-password"
          />
          <span className=" absolute top-0 flex items-center pl-[3%]  pt-[3%]  ">
            <RxLockClosed />
          </span>
        </label>
        <button className="border rounded-[1.5rem] w-full py-[0.7rem] text-white text-[1.2rem] md:text-[1rem] tracking-widest bg-my-black">
          SIGN UP
        </button>
      </form>

      <p className="md:hidden pb-[10%]">
        Already have an account?{" "}
        <span
          className="text-[#0041c2]"
          onClick={(e) => {
            setMobileLinkClicked(!mobileLinkClicked);
          }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUpForm;
