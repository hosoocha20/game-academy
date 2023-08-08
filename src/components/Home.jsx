import React from 'react'

const Home = () => {
  return (
    <div className='home-background px-[7%] pt-[4.875rem]'>
        <div className='text-white md:px-[17%] md:pt-[10%] pt-[15%] px-[2%] flex flex-col gap-[1.9rem] md:items-start items-center '>
            <h1 className='text-5xl md:text-6xl neonTextWelcome border border-[0.2rem] w-fit md:px-[1.8rem] md:py-[1.3rem] px-[1.2rem] py-[1rem] rounded-[0.9rem] neonWelcomeBorder'>WELCOME</h1>
            <h1 className='text-4xl md:text-6xl text-center md:text-left'>to the  <span className="neonText  text-5xl  md:text-7xl inline-block leading-snug">Game Academy</span></h1>
            <div className='md:mt-[1.5rem] md:text-xl text-[1rem]'>
              <p>Browse through our wide range of fun Products to rid you of your boredom.</p>
              <p>Entertain yourself with a round of Chess.</p>
              <p>Check out and become a part of our forum.</p>
            </div>

            <h3>Button</h3>
            
        </div>     
    </div>
  )
}

export default Home