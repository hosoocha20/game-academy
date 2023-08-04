import React, { useState, useEffect, useRef} from "react";
import { HiOutlineTrash } from "react-icons/hi";
import {  SlRefresh } from "react-icons/sl";
import { CgClose } from "react-icons/cg";
import secureLocalStorage from "react-secure-storage";

const ChessGameServer = ({ signedOn }) => {
  const [isInChessGame, setIsInChessGame] = useState(false);
  const [startGameLabel, setStartGameLabel] = useState("Play Game");
  const [isQuitGame, setIsQuitGame] = useState(false);
  const [myColor, setMyColor] = useState('');
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [isMyturn, setIsMyTurn] = useState(false);
  const [myGameID, setMyGameID] = useState("");
  const [whosTurn, setWhosTurn] = useState("");
  const [myMove, setMyMove] = useState("");
  const [listOfMyMoves, setListOfMyMoves] = useState([]);
  const [listOfTheirMoves, setListOfTheirMoves] = useState();
  const [fromMove, setFromMove] = useState("");
  const [a, setA] = useState("a");
  const [b, setB] = useState("b");

  const countRef = React.useRef();
  const getMoveRef = React.useRef();
  const [chessboardOGContent, setChessboardOGContent] = useState('');

  //for Pairing
  const [isNotPaired, setIsNotPaired] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const addMyMove = (m) => {
    setListOfMyMoves((prev) => [...prev, m]);
  };
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

      // let myMoveCommand = `document.getElementById(${e.target.id}).appendChild(document.getElementById(${data}))`;
      addMyMove({
        from: `${fromMove}`,
        to: `${e.target.id}`,
        piece: `${data}`,
      });
    }
  };
  const myDropDelete = (e) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      document.getElementById(data).remove();
    }
  };

  const getTheirMove = (e) => {
    const myCurrentGameID = secureLocalStorage.getItem("gameID");
    console.log(`my gameID: ${myCurrentGameID}`)
    if (myCurrentGameID) {
      const username = secureLocalStorage.getItem("uname");

      fetch(`https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${myCurrentGameID}`, {
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
          if (objectData) {
            clearInterval(getMoveRef.current); // Stop the interval if the condition holds true
            setIsMyTurn(true);
            setWhosTurn("It is your turn")
            const theirMoveArrayString = JSON.parse(objectData);
            theirMoveArrayString.map((m) => {
              document
                .getElementById(m.to)
                .appendChild(document.getElementById(m.piece));
            });
            setListOfTheirMoves(theirMoveArrayString);
          }

          
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    else{
      console.log("app gameid donnt exist")
    }
  };
  const theirMoveInterval = (e) =>{
    console.log("listening")
    getMoveRef.current = setInterval(getTheirMove, 4000);
  }

  const resetMyMove = (e) =>{
    listOfMyMoves.map((m) =>{
      document.getElementById(m.from).appendChild(document.getElementById(m.piece));
    })
    setListOfMyMoves([]);
  }

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
          let opponentMove = objectData.lastMovePlayer1;
          setMyGameID(objectData.gameId);
          secureLocalStorage.setItem("gameID", objectData.gameId);
          console.log(objectData.gameId);
          if (objectData.player1 == username) {
            setMyColor("White")
            setIsMyTurn(true);
            setWhosTurn("It is your turn");
            setOpponentPlayer(objectData.player2);
            opponentMove = objectData.lastMovePlayer2;
          } else {
            setMyColor("Black")
            setWhosTurn("It is your Opponent's turn");
            setOpponentPlayer(objectData.player1);
          }
          if (objectData.state !== "progress") {
            setOpenModal(true);  
          } else {
            setIsInChessGame(true);
            setIsNotPaired(null);
            if (objectData.player2 === username){
              theirMoveInterval();
            }
            clearInterval(countRef.current);
            setOpenModal(false);

          }
        });
    } else {
      alert("Please log in to play with an opponent online");
    }
  };

  const paringOnClick = (e) =>{
    setStartGameLabel("Loading...");
    setIsNotPaired(null)
      countRef.current = setInterval(startGame, 5000);
      setTimeout(() => {
        setOpenModal(false);
        setStartGameLabel("Play Game");
        setIsNotPaired(true);
      }, 35000);
      setTimeout(function( ) { clearInterval( countRef.current ); }, 30000);


  }



  const postMyMove = (e) => {
    const arr = JSON.stringify(listOfMyMoves);
    if (signedOn && myGameID) {
      fetch("https://cws.auckland.ac.nz/gas/api/MyMove", {
        method: "POST",
        body: JSON.stringify({
          gameId: myGameID,
          move: arr,
        }),
        headers: {
          Authorization:
            "Basic " +
            btoa(
              `${secureLocalStorage.getItem(
                "uname"
              )}:${secureLocalStorage.getItem("pw")}`
            ),
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
          setListOfMyMoves([]);
          setWhosTurn("It is your Opponents Turn");
          theirMoveInterval();
        });
    }
  };

  const quitGame = (e) => {
    if (signedOn && secureLocalStorage.getItem("gameID")) {
      fetch(
        `https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=${secureLocalStorage.getItem(
          "gameID"
        )}`,
        {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                `${secureLocalStorage.getItem(
                  "uname"
                )}:${secureLocalStorage.getItem("pw")}`
              ),
            Accept: "text/plain",
          },
        }
      )
        .then((data) => {
          return data.text();
        })
        .then((textData) => {
          const chessboardCurrTemp = document.getElementById('chessboard-temp');
          chessboardCurrTemp.innerHTML = chessboardOGContent;
          clearInterval(getMoveRef.current); 
          clearInterval( countRef.current );
          setIsInChessGame(false);
          setIsNotPaired(null);
          setIsQuitGame(true);
          setMyGameID('');
          secureLocalStorage.removeItem("gameID");
        });
    } else {
      alert("Something went wrong. Please try again");
    }
  };

  //   useEffect(() => {
  //     return () => {
  //         // Anything in here is fired on component unmount.
  //           //quitGame();
  //           console.log('quit')

  //     };
  // }, [])

  const closeModal = (e) =>{
    clearInterval( countRef.current );
    setOpenModal(false);
    quitGame();
  }

  useEffect(() => {
    const unloadCallback = (event) => {
      console.log("quit");
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  useEffect(() =>{
    const OGTemp = document.getElementById('chessboard-temp');
    const OGContent = OGTemp.innerHTML;
    //console.log(OGContent);
    setChessboardOGContent(OGContent);
  },[])

  return (
    <div className="relative flex gap-[3rem] w-full h-full pt-[1rem]">
      {(openModal) && (
        <div className="myModal w-full h-full absolute  flex justify-center items-center bg-black/70">
        <div className="relative modalContent  w-[40%] h-[40%]  bg-[#fefefe] flex flex-col items-center justify-center rounded">
          <button className="absolute top-[1.5rem] right-[2rem]  text-[1.5rem]" onClick={closeModal}>
            <CgClose/>
          </button>
          
          <p>Searching for Opponent...</p>
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      </div>
    )}

      <div className="chessboard w-full h-full flex flex-col items-center">
        <div className="chessboard-container  w-full grid grid-cols-10 auto-rows-fr border rounded-[0.5rem]" id='chessboard-temp'>
          <div
            className=" bg-chess-rim border-r-2 border-b-2 border-dashed rounded-tl-lg"
            id="fs1"
          ></div>
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
          <div className="flex items-center justify-center bg-chess-rim">e</div>
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
            className=" flex items-center justify-center text-[2em] bg-chess-rim rounded-tr-lg"
            id="bin1"
            onDrop={(e) => myDropDelete(e)}
            onDragOver={(e) => myDragOver(e)}
          >
            <HiOutlineTrash />
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
            className=" flex items-center justify-center text-[2em] bg-chess-rim rounded-bl-lg"
            id="bin2"
            onDrop={(e) => myDropDelete(e)}
            onDragOver={(e) => myDragOver(e)}
          >
            <HiOutlineTrash />
          </div>
          <div className="flex items-center justify-center bg-chess-rim">a</div>
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
          <div
            className="bg-chess-rim border-l-2 border-t-2 border-dashed rounded-br-lg"
            id="fs2"
          ></div>
        </div>
      </div>
      <div className="w-[75%]  px-[2.5%] py-[2.5%] border rounded-[0.5rem] bg-[#EBECF0] flex flex-col">
      <div className="flex justify-between">
            {!isInChessGame && (
              <button
                  className="border rounded px-[1.5em] py-[0.8em] text-white bg-my-black"
                  id="startBtn"
                  onClick={(e) => paringOnClick(e)}
              >
                  {startGameLabel}
              </button>
            )}
            {isInChessGame && !isMyturn && (
            <button
                className="opponentMoveBtn border border-[#AAAAAA] rounded-[1.5rem] px-[2.5em] py-[0.25em] bg-[#AAAAAA]"
                id="getMoveBtn"
                aria-label="Get Move"
                onClick={getTheirMove}
            >
                <div className="loader w-[4rem]">
                  <li className="ball"></li>
                  <li className="ball"></li>
                  <li className="ball"></li>
                </div>
            </button>
            )}
            {(isInChessGame && isMyturn) && (
                <div className="flex items-center gap-x-[1.5rem]">
                    <button
                        className="border border-valid-green-light rounded px-[0.5em] py-[0.8em] bg-valid-green-light"
                        id="sendMoveBtn"
                        aria-label="Send Move"
                        onClick={postMyMove}
                    >
                        Send my Move
                    </button>
                    <button className="border border-[#AAAAAA] rounded px-[0.5em] py-[0.8em] flex items-center gap-x-[0.5rem] bg-[#AAAAAA]" id='resetMoveBtn' aria-label="Reset Move" onClick={resetMyMove}>
                      Reset Move
                      <SlRefresh className="text-[1.2rem] cursor-pointer" aria-label="Reset your Move"/>
                    </button>
                    

            </div>
            )}


            {isInChessGame && (
            <button
                className="border border-error-red-dark rounded px-[0.5em] py-[0.8em] bg-error-red-dark text-white"
                id="quitBtn"
                aria-label="Quit Game"
                onClick={quitGame}
            >
                Quit Game
            </button>
            )}
        </div>
        <div className="border">
          {(isNotPaired && !isInChessGame) && (
            <div className="border border-error-red-dark bg-error-red-light rounded px-[1rem] py-[1rem] mt-[2rem]">
            <p>There are currently no active opponents</p>
            <p>Please try again or come back later</p>
          </div>
          )}
          {(isInChessGame) && (
            <div className='flex flex-col gap-y-[1.5rem] mt-[2rem] border border-valid-green-dark bg-valid-green-light/80 rounded justify-center px-[1rem] py-[1rem]'>
            <div id="gameStartData">
              <p>You have been matched with user <b>{opponentPlayer}</b></p>
              <p>Your Pieces are <b>{myColor}</b></p>
              <p>Good Luck!</p>
            </div>
            {(whosTurn && isInChessGame) && <p className="text-center text-[1.25rem] font-bold">{whosTurn}</p>}
          </div>
          )}

        </div>




      </div>
    </div>
  );
};

export default ChessGameServer;
