import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Game = ({ signedOn }) => {
  const [gameOpened, setGameOpened] = useState("gameMenu");
  const [isGameOpened, setIsGameOpened] = useState(false);
  const [gameName, setGameName] = useState("");

  const navigate = useNavigate();

  const openGame = (g, gn) => {
    setIsGameOpened(true);
    navigate("onlineChess");
    setGameOpened(g);
    setGameName(gn);
  };
  const backToGame = (e) => {
    setIsGameOpened(false);
    navigate("/game");
  };

  return (
    <div className="pt-[4.875rem] md:px-[10%] px-[5%] pb-[3rem] w-full">
      {!isGameOpened && (
        <div className="mt-[2.5rem] flex flex-col gap-[1em]">
          <h2 className="text-[2em] text-center">Games</h2>
          <p className="text-center">Play some of the best classic games!</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] mt-[1.5em] w-full gap-x-[4.5rem] gap-y-[1rem]">
            <button
              className=" border rounded-[1rem] w-full   py-[4em] text-center chessOnlineImg"
              onClick={(e) => openGame("chessGameServer", "Chess Online")}
            >
              Chess Online
            </button>
            <button className="border rounded-[1rem] w-full   py-[4em] text-center chessLocalImg">
              Chess Two Player
              <p className="text-[0.7rem] italic text-gray-600">
                Coming soon...
              </p>
            </button>
            <button className="border rounded-[1rem] w-full  py-[4em] text-center comingSoonImg">
              More coming soon...
            </button>
          </div>
        </div>
      )}
      {isGameOpened && (
        <div className=" mt-[2rem] w-full">
          <div className="flex justify-between items-center">
            <button
              className="border bg-my-black text-my-white rounded px-[1em] py-[0.5em]"
              onClick={backToGame}
            >
              Back to Games
            </button>
            <h4 className="text-[1.5rem]">{gameName}</h4>
            <div className="invisible text-my-white rounded md:px-[1em] md:py-[0.5em] px-[0.2rem] py-0  w-0">
              Back to Games
            </div>
          </div>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Game;
