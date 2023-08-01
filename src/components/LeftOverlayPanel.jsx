import React from 'react'

const LeftOverlayPanel = ({isAnimated, setIsAnimated}) => {
  return (
    <div className='w-full h-full flex flex-col items-center pt-[78px] gap-[1.8rem] text-white'>
        <h1 className='text-[2.3rem] font-semibold pt-[38%]'>Welcome Back!</h1>
        <p className='pb-[10%]'>Sign in to continue your game</p>
        <button className='rounded-[1.3rem] w-[40%] py-[0.6rem] border tracking-widest' onClick={(e)=> {setIsAnimated(!isAnimated)}}>SIGN IN</button>
    </div>
  )
}

export default LeftOverlayPanel