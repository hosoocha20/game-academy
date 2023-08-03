import React, { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import ChessGameServer from "./ChessGameServer";

const Game = ({ signedOn }) => {
  const [gameOpened, setGameOpened] = useState('gameMenu');
  const [isGameOpened, setIsGameOpened] = useState(false);
  const [gameName, setGameName] = useState('');

  const openGame = (g,gn) =>{
    setIsGameOpened(true);
    setGameOpened(g);
    setGameName(gn);
  }
  const backToGame = (e) =>{
    setIsGameOpened(false);
  }
  const marginBottomStyle = '';

  return (
    <div className="pt-[4.875rem] px-[10%] w-full h-full overflow-x-hidden">
      {(!isGameOpened) &&(
        <div className='mt-[2.5rem] flex flex-col gap-[1em]'>
          <h2 className="text-[2em] text-center">Games</h2>
          <p className="text-center">Play some of the best classic games!</p>
          <div className="game-buttons flex justify-center gap-x-[5%] mt-[1.5em]">
            <button className=' border rounded-[1rem] w-[25%] py-[4em] text-center chessOnlineImg' onClick={(e)=>openGame('chessGameServer', 'Chess Online')}>
              Chess Online
            </button>
            <button className='border rounded-[1rem] w-[25%] py-[4em] text-center chessLocalImg'>
              Chess Two Player
            </button>
            <button className="border rounded-[1rem] w-[25%] py-[4em] text-center comingSoonImg">
              Coming more soon...
            </button>
          </div>
        </div>
      )}
      {isGameOpened && (
        <div className=' mt-[2rem] w-full'>
          <div className="flex justify-between items-center">
            <button className='border bg-my-black text-my-white rounded px-[1em] py-[0.5em]' onClick={backToGame}>
              Back to Games
            </button>
            <h4 className='text-[1.5rem]'>{gameName}</h4>
            <div className='invisible text-my-white rounded px-[1em] py-[0.5em]'>Back to Games</div>
          </div>

          {(gameOpened === 'chessGameServer') && (
              <ChessGameServer signedOn={signedOn}/>
          )}
        </div>  
      )}

    </div>
  );
};

export default Game;
