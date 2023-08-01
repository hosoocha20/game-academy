import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import secureLocalStorage from "react-secure-storage";

const Game = ({signedOn}) => {
    const [chessStartButtonText, setChessStartButtonText] = useState('Play Game');
    const [isInChessGame, setIsInChessGame] = useState(false);

  const myDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  };
  const myDragOver = (e) => {
    e.preventDefault();
  };
  const myDrop = (e) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      alert(`dropped data: ${data}`);
      e.target.appendChild(document.getElementById(data));
    }
  };
  const myDropDelete = (e) => {
    if (e.dataTransfer) {
        const data = e.dataTransfer.getData("text/plain");
        document.getElementById(data).remove();
      }  
  };

  const startGame = (e) =>{
    if (signedOn){
        const username = secureLocalStorage.getItem("uname")
        fetch('https://cws.auckland.ac.nz/gas/api/PairMe',{
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${secureLocalStorage.getItem("pw")}`),
                'Accept': 'text/plain'
            }
        })
        .then((data)=>{
          return data.json();   
        }).then((objectData)=>{
          const gameoutput = document.getElementById('gameStartData');
          let textOutput ="";
          let opponent = objectData.player1;
          let opponentMove = objectData.lastMovePlayer1;
          if (objectData.player1 == username){
            opponent = objectData.player2;
            opponentMove = objectData.lastMovePlayer2;
          }
          if (objectData.state == "progress"){
            setIsInChessGame(true);
             textOutput =`<p>You are in a game with user     <b>${opponent}</b></p>
                          <p>Last Move played by Opponent:   <b>${opponentMove}</b></p>`; 
              document.getElementById('quitBtn').style.display="inline-block"; 
              document.getElementById('quitBtn').value=`${objectData.gameId}`;        
          }
          else{
            setChessStartButtonText("Pair me");
            textOutput =`<p>You have not been paired with an opponent.</p>
            <p>Try again later or Click the Pair Me button to see your pairing state.</p>
            <p><i>Note: Please do not spam the Pair Me button </i><p>`;   
          }
          gameoutput.innerHTML = textOutput;
  
        })
    }
    else{
        alert("Please log in to play with an opponent online")
    }
  }
  return (
    <div className="pt-[78px] w-full h-full">
      <h2>Games</h2>
      <p>Play some of the best classic games!</p>
      <div>
        <div className="flex flex-col items-center">
          <h3>Chess</h3>
          <div className="chessboard w-[35%]">
            <div className="rulesTextBox">
              <p>The rules.............</p>
            </div>
            <div className="chessboard-container  grid grid-cols-10 auto-rows-fr border">
              <div className=" bg-chess-rim border-r-2 border-b-2 border-dashed"></div>
              <div className=" flex items-center justify-center bg-chess-rim">a</div>
              <div className=" flex items-center justify-center bg-chess-rim">b</div>
              <div className=" flex items-center justify-center bg-chess-rim">c</div>
              <div className=" flex items-center justify-center bg-chess-rim">d</div>
              <div className="flex items-center justify-center bg-chess-rim">e</div>
              <div className=" flex items-center justify-center bg-chess-rim">f</div>
              <div className=" flex items-center justify-center bg-chess-rim">g</div>
              <div className=" flex items-center justify-center bg-chess-rim">h</div>
              <div className=" flex items-center justify-center text-[2em] bg-chess-rim"
                    onDrop={(e) => myDropDelete(e)}
                    onDragOver={(e) => myDragOver(e)}>
                <HiOutlineTrash />
              </div>

              <div className=" flex items-center justify-center bg-chess-rim">8</div>
              <div className="  bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rb.svg"
                  id="rb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nb.svg"
                  id="nb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bb.svg"
                  id="bb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Qb.svg"
                  id="qb"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Kb.svg"
                  id="kb"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bb.svg"
                  id="bb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nb.svg"
                  id="nb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rb.svg"
                  id="rb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center bg-chess-rim">7</div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb3"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb4"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb5"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb6"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb7"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pb.svg"
                  id="pb8"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">6</div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-rim"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">5</div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">4</div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-rim"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center bg-chess-rim">3</div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center bg-chess-rim">2</div>
              <div
                className=" bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw3"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw4"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw5"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw6"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw7"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Pw.svg"
                  id="pw8"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">1</div>
              <div className="  bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rw.svg"
                  id="rw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nw.svg"
                  id="nw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className="  bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bw.svg"
                  id="bw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Qw.svg"
                  id="qw"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Kw.svg"
                  id="kw"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bw.svg"
                  id="bw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-blackSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nw.svg"
                  id="nw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div className=" bg-chess-whiteSqaure">
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rw.svg"
                  id="rw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center text-[2em] bg-chess-rim"
                    onDrop={(e) => myDropDelete(e)}
                    onDragOver={(e) => myDragOver(e)}>
                <HiOutlineTrash />
              </div>
              <div className="flex items-center justify-center bg-chess-rim">a</div>
              <div className=" flex items-center justify-center bg-chess-rim">b</div>
              <div className=" flex items-center justify-center bg-chess-rim">c</div>
              <div className=" flex items-center justify-center bg-chess-rim">d</div>
              <div className=" flex items-center justify-center bg-chess-rim">e</div>
              <div className=" flex items-center justify-center bg-chess-rim">f</div>
              <div className=" flex items-center justify-center bg-chess-rim">g</div>
              <div className=" flex items-center justify-center bg-chess-rim">h</div>
              <div className="bg-chess-rim border-l-2 border-t-2 border-dashed"></div>
            </div>
            <div>
              <p id="gameStartData">hi</p>
            </div>
            </div>
            <div className="chess-button-container w-[70%]">
                <button className='border border-[#1F75FE] rounded px-[0.5em] py-[0.25em] bg-[#77a8ff]' id="getMoveBtn">Get Opponents Move</button>
                <button className='border border-valid-green-dark rounded px-[0.5em] py-[0.25em] bg-valid-green-light' id="sendMoveBtn">Send my Move</button>
                <button className='border rounded px-[0.5em] py-[0.25em] text-white bg-my-black' id="startBtn" onClick={(e) =>startGame(e)}>{chessStartButtonText}</button>
                <button className='border border-error-red-dark rounded px-[0.5em] py-[0.25em] bg-error-red-light text-error-red-dark' id="quitBtn" value="">
                Quit Game
              </button>
            </div>
        </div>
        <div>
          <h3>Coming more soon...</h3>
        </div>
      </div>
    </div>
  );
};

export default Game;
