import React, { useState } from 'react'

import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm';
import LeftOverlayPanel from './LeftOverlayPanel';
import RightOverlayPanel from './RightOverlayPanel';

const Login = ({handleActiveTabChange, signedOn, setSignedOn}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [mobileLinkClicked, setMobileLinkClicked] = useState(false);
  const overlayBg ="bg-gradient-to-l from-gray-700 via-gray-900 to-black";


    
  return (
    <div className={` pt-[78px] h-full w-full relative overflow-hidden`}>
      <div id='signIn'
        className={`absolute top-0 left-0 h-full w-full md:w-[60%] flex justify-center items-center md:transition-all md:duration-700 md:ease-in-out z-20 ${
          isAnimated ? "translate-x-full opacity-0" : ""
        } ${
          mobileLinkClicked ? "opacity-0" : ""
        }
        `}>
        <SignInForm handleActiveTabChange={handleActiveTabChange} mobileLinkClicked={mobileLinkClicked} setMobileLinkClicked={setMobileLinkClicked} setSignedOn={setSignedOn}/>
      </div>
      <div id="signUp"
        className={`absolute top-0 left-0 h-full w-full md:w-[60%] flex justify-center items-center md:transition-all md:duration-700 md:ease-in-out ${
          isAnimated
            ? "translate-x-[67%] opacity-100 z-50 animate-show"
            : "opacity-0 z-10"
        }
        ${
          mobileLinkClicked ? "opacity-100 z-50" : "opacity-0 z-10"
        }
        `}>
        <SignUpForm mobileLinkClicked={mobileLinkClicked} setMobileLinkClicked={setMobileLinkClicked}/>
      </div>

      <div id='overlay-container'
        className={`hidden md:block absolute top-0 left-[60%] w-[40%] h-full overflow-hidden transition transition-transform duration-700 ease-in-out z-100 ${
          isAnimated ? "-translate-x-[150%]" : ""
        }`}>
        <div id='overlay'
          className={`${overlayBg} relative -left-full h-full w-[200%] transform transition transition-transform duration-700 ease-in-out ${
            isAnimated ? "translate-x-1/2" : "translate-x-0"
          }`}>
          <div id='overlay-left'
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform -translate-x-[0%] transition transition-transform duration-700 ease-in-out ${
              isAnimated ? "translate-x-0" : "-translate-x-[20%]"
            }`}>
            <LeftOverlayPanel isAnimated={isAnimated} setIsAnimated={setIsAnimated}/>
          </div>
          <div id='overlay-right'
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition transition-transform duration-700 ease-in-out ${
              isAnimated ? "translate-x-[20%]" : "translate-x-0"
            }`}>
            <RightOverlayPanel isAnimated={isAnimated} setIsAnimated={setIsAnimated}/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login