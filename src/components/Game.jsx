import React, { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import secureLocalStorage from "react-secure-storage";

const Game = ({ signedOn }) => {
  const [chessStartButtonText, setChessStartButtonText] = useState("Play Game");
  const [isInChessGame, setIsInChessGame] = useState(false);
  const [isQuitGame, setIsQuitGame] = useState(false);
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [isMyturn, setIsMyTurn] = useState(false);
  const [myGameID, setMyGameID] = useState("");
  const [whosTurn, setWhosTurn] = useState("");
  const [myMove, setMyMove] = useState('');
  const [listOfMyMoves, setListOfMyMoves] = useState([]);
  const [listOfTheirMoves, setListOfTheirMoves] = useState();
  const [fromMove, setFromMove] = useState('');
  const [a, setA] = useState('a')
  const [b, setB] = useState('b');

  const addMyMove = (m) =>{
    setListOfMyMoves(prev => [...prev, m]);
  }
  const myDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    setFromMove(`${e.target.parentNode.id}`);
  };
  const myDragOver = (e) => {
    e.preventDefault();
  };
  const myDrop = (e) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      alert(`dropped data: ${e.target.id}`);
      e.target.appendChild(document.getElementById(data));

      let myMoveCommand = `document.getElementById(${e.target.id}).appendChild(document.getElementById(${data}))`;
      addMyMove({
        from: `${fromMove}`,
        to: `${e.target.id}`,
        piece: `${data}`
      })

    }
  };
  const myDropDelete = (e) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      document.getElementById(data).remove();
    }
  };

  const startGame = (e) => {
    if (signedOn) {
      const username = secureLocalStorage.getItem("uname");
      fetch("https://cws.auckland.ac.nz/gas/api/PairMe", {
        headers: {
          Authorization:
            "Basic " + btoa(`${username}:${secureLocalStorage.getItem("pw")}`),
          Accept: "text/plain",
        },
      })
        .then((data) => {
          return data.json();
        })
        .then((objectData) => {
          const gameoutput = document.getElementById("gameStartData");
          let textOutput = "";
          let opponent = objectData.player1;
          let opponentMove = objectData.lastMovePlayer1;
          setMyGameID(objectData.gameId);
          secureLocalStorage.setItem("gameID", objectData.gameId);
          console.log(objectData.gameId);
          if (objectData.player1 == username) {
            setPlayerOne(username);
            setIsMyTurn(true);
            setWhosTurn("It is your turn");
            setOpponentPlayer(objectData.player1);
            opponent = objectData.player2;
            opponentMove = objectData.lastMovePlayer2;
          } else {
            setPlayerTwo(username);
            setWhosTurn("It is your Opponent's turn");
            setOpponentPlayer(objectData.player1);
          }
          if (objectData.state == "progress") {
            setIsInChessGame(true);

            textOutput = `<p>You are in a game with user     <b>${opponent}</b></p>`;
            // document.getElementById('quitBtn').value=`${objectData.gameId}`;
          } else {
            setChessStartButtonText("Pair me");
            textOutput = `<p>You have not been paired with an opponent.</p>
            <p>Try again later or Click the Pair Me button to see your pairing state.</p>
            <p><i>Note: Please do not spam the Pair Me button </i><p>`;
          }
          gameoutput.innerHTML = textOutput;
        });
    } else {
      alert("Please log in to play with an opponent online");
    }
  };

  const getTheirMove = (e) =>{
    
    if (myGameID){
      const username = secureLocalStorage.getItem("uname");

          fetch(`https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${myGameID}`, {
            headers: {
              Authorization:
                "Basic " + btoa(`${username}:${secureLocalStorage.getItem("pw")}`),
              Accept: "text/plain",
            },
          })
            .then((data) => {
              return data.text();
            })
            .then((objectData) => {
              if(objectData){
                setIsMyTurn(true);
                const theirMoveArrayString = JSON.parse(objectData);
                console.log(typeof theirMoveArrayString);
                theirMoveArrayString.map(m =>{
                  document.getElementById(m.to).appendChild(document.getElementById(m.piece));
                })
                setListOfTheirMoves(theirMoveArrayString);
              }
              console.log(objectData)
              


              
              

          }).catch(function (err){
         console.log(err)
          })
    }
  }
// const theirMoveInterval = (e) =>{
//   let intervalID = setInterval(() => {getTheirMove()}, 10000);
//     if (isMyturn) {
//       clearInterval(intervalID); // Stop the interval if the condition holds true
//     }
// }

  

  const postMyMove = (e) =>{
    const arr = JSON.stringify(listOfMyMoves)
    if(signedOn && myGameID){
      fetch("https://cws.auckland.ac.nz/gas/api/MyMove", {
        method: "POST",
        body: JSON.stringify({
          gameId: myGameID,
          move: arr,
        }),
        headers: {
          Authorization:
          "Basic " + btoa(`${secureLocalStorage.getItem("uname")}:${secureLocalStorage.getItem("pw")}`),
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          //console.log(data);
            setIsMyTurn(false);

          alert(data);
        });

    }
  }

const quitGame = (e) => {
  
  if (signedOn && secureLocalStorage.getItem('gameID')){
      fetch(`https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=${secureLocalStorage.getItem('gameID')}`,{
          headers: {
              'Authorization': 'Basic ' + btoa(`${secureLocalStorage.getItem("uname")}:${secureLocalStorage.getItem("pw")}`),
              'Accept': 'text/plain'
          }
      })
      .then((data)=>{
        return data.text();   
      }).then((textData)=>{
        setIsInChessGame(false);
          var gameoutput = document.getElementById('gameStartData');     
          setIsQuitGame(true); 
          //gameoutput.innerHTML = textData;
          //gameoutput.innerHTML = '<p>Game Over</p>'
          secureLocalStorage.removeItem("gameID");

      })
  }
  else{
    alert("Something went wrong. Please try again");
  }
}



//   useEffect(() => {
//     return () => {
//         // Anything in here is fired on component unmount.
//           //quitGame();
//           console.log('quit')

//     };
// }, [])

useEffect(() => {
  const unloadCallback = (event) => { console.log('quit')};

  window.addEventListener("beforeunload", unloadCallback);
  return () => window.removeEventListener("beforeunload", unloadCallback);
}, []);



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
              <div className=" bg-chess-rim border-r-2 border-b-2 border-dashed" id='fs1'></div>
              <div className=" flex items-center justify-center bg-chess-rim">
                a
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                b
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                c
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                d
              </div>
              <div className="flex items-center justify-center bg-chess-rim">
                e
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                f
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                g
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                h
              </div>
              <div
                className=" flex items-center justify-center text-[2em] bg-chess-rim"
                id='bin1'
                onDrop={(e) => myDropDelete(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <HiOutlineTrash/>
              </div>

              <div className=" flex items-center justify-center bg-chess-rim">
                8
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="a8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rb.svg"
                  id="rb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="b8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nb.svg"
                  id="nb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="c8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bb.svg"
                  id="bb1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="d8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Qb.svg"
                  id="qb"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                id="e8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Kb.svg"
                  id="kb"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                id="f8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bb.svg"
                  id="bb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="g8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nb.svg"
                  id="nb2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="h8"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
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

              <div className=" flex items-center justify-center bg-chess-rim">
                7
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="a7"
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
                id="b7"
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
                id="c7"
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
                id="d7"
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
                id="e7"
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
                id="f7"
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
                id="g7"
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
                id="h7"
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

              <div className="  flex items-center justify-center bg-chess-rim">
                6
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="a6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="b6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="c6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="d6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="e6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="f6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="g6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="h6"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-rim"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">
                5
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="a5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="b5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="c5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="d5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="e5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="f5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="g5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="h5"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className="  flex items-center justify-center bg-chess-rim">
                4
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="a4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="b4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="c4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="d4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="e4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="f4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-whiteSqaure"
                id="g4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-blackSqaure"
                id="h4"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className=" bg-chess-rim"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center bg-chess-rim">
                3
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="a3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="b3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="c3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="d3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="e3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="f3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-blackSqaure"
                id="g3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="  bg-chess-whiteSqaure"
                id="h3"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>
              <div
                className="bg-chess-rim "
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              ></div>

              <div className=" flex items-center justify-center bg-chess-rim">
                2
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                id="a2"
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
                id="b2"
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
                id="c2"
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
                id="d2"
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
                id="e2"
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
                id="f2"
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
                id="g2"
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
                id="h2"
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

              <div className="  flex items-center justify-center bg-chess-rim">
                1
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="a1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Rw.svg"
                  id="rw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-whiteSqaure"
                id="b1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nw.svg"
                  id="nw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className="  bg-chess-blackSqaure"
                id="c1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bw.svg"
                  id="bw1"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                id="d1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Qw.svg"
                  id="qw"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                id="e1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Kw.svg"
                  id="kw"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                id="f1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Bw.svg"
                  id="bw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-blackSqaure"
                id="g1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <img
                  src="https://cws.auckland.ac.nz/gas/images/Nw.svg"
                  id="nw2"
                  draggable="true"
                  onDragStart={(e) => myDragStart(e)}
                />
              </div>
              <div
                className=" bg-chess-whiteSqaure"
                id="h1"
                onDrop={(e) => myDrop(e)}
                onDragOver={(e) => myDragOver(e)}
              >
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

              <div
                className=" flex items-center justify-center text-[2em] bg-chess-rim"
                id='bin2'
                onDrop={(e) => myDropDelete(e)}
                onDragOver={(e) => myDragOver(e)}
              >
                <HiOutlineTrash/>
              </div>
              <div className="flex items-center justify-center bg-chess-rim">
                a
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                b
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                c
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                d
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                e
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                f
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                g
              </div>
              <div className=" flex items-center justify-center bg-chess-rim">
                h
              </div>
              <div className="bg-chess-rim border-l-2 border-t-2 border-dashed" id='fs2'></div>
            </div>
            <div>
              <p id="gameStartData">hi</p>
              {whosTurn && <p>{whosTurn}</p>}
            </div>
          </div>
          <div className="chess-button-container w-[70%]">
            {(isInChessGame && !isMyturn) && (
              <button
                className="border border-[#1F75FE] rounded px-[0.5em] py-[0.25em] bg-[#77a8ff]"
                id="getMoveBtn"
                onClick={getTheirMove}
              >
                Get Opponents Move
              </button>
            )}
            {(isInChessGame && isMyturn) && (
              <button
                className="border border-valid-green-dark rounded px-[0.5em] py-[0.25em] bg-valid-green-light"
                id="sendMoveBtn"
                onClick={postMyMove}
              >
                Send my Move
              </button>
            )}

            {!isInChessGame && (
              <button
                className="border rounded px-[0.5em] py-[0.25em] text-white bg-my-black"
                id="startBtn"
                onClick={(e) => startGame(e)}
              >
                {chessStartButtonText}
              </button>
            )}
            {isInChessGame && (
              <button
                className="border border-error-red-dark rounded px-[0.5em] py-[0.25em] bg-error-red-light text-error-red-dark"
                id="quitBtn"
                onClick={quitGame}
              >
                Quit Game
              </button>
            )}
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
