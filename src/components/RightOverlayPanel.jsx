import React from 'react'

const RightOverlayPanel = ({isAnimated, setIsAnimated}) => {
  return (
    <div className='w-full h-full flex flex-col items-center text-white pt-[78px] gap-[1.8rem]'>
        <h1 className='text-[2.2rem] font-semibold pt-[38%]'>Hello, Friend!</h1>
        <p className='pb-[10%]'>Join now to stay connected to us</p>
        <button className='rounded-[1.3rem] w-[40%] py-[0.6rem] border tracking-widest' onClick={(e)=> {setIsAnimated(!isAnimated)}}>SIGN UP</button>
    </div>
  )
}

export default RightOverlayPanel