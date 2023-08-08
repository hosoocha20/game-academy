import React, { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { SlRefresh } from "react-icons/sl";
import { CgClose } from "react-icons/cg";
import secureLocalStorage from "react-secure-storage";

const ChessGameServer = ({ signedOn }) => {
  const [isInChessGame, setIsInChessGame] = useState(false);
  const [openHowToPlay, setOpenHowToPlay] = useState(false);
  const [startGameLabel, setStartGameLabel] = useState("Play Game");
  const [opponentQuit, setOpponentQuit] = useState(false);
  const [isQuitGame, setIsQuitGame] = useState(false);
  const [myColor, setMyColor] = useState("");
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [isMyturn, setIsMyTurn] = useState(false);
  const [myGameID, setMyGameID] = useState("");
  const [whosTurn, setWhosTurn] = useState("");
  const [listOfMyMoves, setListOfMyMoves] = useState([]);
  const [listOfTheirMoves, setListOfTheirMoves] = useState("");
  const resetBoard = [
    { piece: "pw1", to: "a2" },
    { piece: "pw2", to: "b2" },
    { piece: "pw3", to: "c2" },
    { piece: "pw4", to: "d2" },
    { piece: "pw5", to: "e2" },
    { piece: "pw6", to: "f2" },
    { piece: "pw7", to: "g2" },
    { piece: "pw8", to: "h2" },
    { piece: "rw1", to: "a1" },
    { piece: "nw1", to: "b1" },
    { piece: "bw1", to: "c1" },
    { piece: "qw", to: "d1" },
    { piece: "kw", to: "e1" },
    { piece: "bw2", to: "f1" },
    { piece: "nw2", to: "g1" },
    { piece: "rw2", to: "h1" },
    { piece: "pb1", to: "a7" },
    { piece: "pb2", to: "b7" },
    { piece: "pb3", to: "c7" },
    { piece: "pb4", to: "d7" },
    { piece: "pb5", to: "e7" },
    { piece: "pb6", to: "f7" },
    { piece: "pb7", to: "g7" },
    { piece: "pb8", to: "h7" },
    { piece: "rb1", to: "a8" },
    { piece: "nb1", to: "b8" },
    { piece: "bb1", to: "c8" },
    { piece: "qb", to: "d8" },
    { piece: "kb", to: "e8" },
    { piece: "bb2", to: "f8" },
    { piece: "nb2", to: "g8" },
    { piece: "rb2", to: "h8" },
  ];
  const [fromMove, setFromMove] = useState("");
  const [validMove, setValidMove] = useState(true);

  const countRef = React.useRef();
  const countOutRef = React.useRef();
  const getMoveRef = React.useRef();

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
  const myDrop = (e, binID) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      try {
        e.target.appendChild(document.getElementById(data));
        if (binID) {
          addMyMove({
            from: `${fromMove}`,
            to: `${binID}`,
            piece: `${data}`,
          });
        } else {
          addMyMove({
            from: `${fromMove}`,
            to: `${e.target.id}`,
            piece: `${data}`,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const myDropDelete = (e, id) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      addMyMove({
        from: `${fromMove}`,
        to: `${id}`,
        piece: `${data}`,
      });
      document.getElementById(data).remove();
    }
  };

  const getTheirMove = (e) => {
    const myCurrentGameID = secureLocalStorage.getItem("gameID");
    //console.log(`my gameID: ${myCurrentGameID}`)
    if (myCurrentGameID) {
      const username = secureLocalStorage.getItem("uname");

      fetch(
        `https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${myCurrentGameID}`,
        {
          headers: {
            Authorization:
              "Basic " +
              btoa(`${username}:${secureLocalStorage.getItem("pw")}`),
            Accept: "text/plain",
          },
        }
      )
        .then((data) => {
          return data.text();
        })
        .then((objectData) => {
          if (objectData) {
            if (objectData === "(no such gameId)") {
              setOpponentQuit(true);
              quitGame();
              return;
            }
            clearInterval(getMoveRef.current);
            setIsMyTurn(true);
            setWhosTurn("It is your turn");
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
    } else {
      console.log("Gameid does not exist");
    }
  };
  const theirMoveInterval = (e) => {
    //console.log("listening")
    getMoveRef.current = setInterval(getTheirMove, 4000);
  };

  const resetMyMove = (e) => {
    listOfMyMoves.map((m) => {
      document
        .getElementById(m.from)
        .appendChild(document.getElementById(m.piece));
    });
    setListOfMyMoves([]);
  };

  const startGame = (e) => {
    setOpponentQuit(false);
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
          setMyGameID(objectData.gameId);
          secureLocalStorage.setItem("gameID", objectData.gameId);
          if (objectData.state !== "progress") {
            setOpenModal(true);
          } else {
            clearInterval(countRef.current);
            setOpenModal(false);
            setIsInChessGame(true);
            setIsNotPaired(null);
            if (objectData.player1 == username) {
              setMyColor("White");
              setIsMyTurn(true);
              setWhosTurn("It is your turn");
              setOpponentPlayer(objectData.player2);
            } else {
              setMyColor("Black");
              setWhosTurn("It is your Opponent's turn");
              setOpponentPlayer(objectData.player1);
              theirMoveInterval();
            }
          }
        });
    } else {
      clearInterval(countRef.current);
      alert("Please log in to play with an opponent online");
    }
  };

  const paringOnClick = (e) => {
    if (!signedOn) {
      alert("Please log in to play with an opponent online");
      return;
    }
    setStartGameLabel("Loading...");
    setIsNotPaired(null);
    setOpenModal(true);
    countRef.current = setInterval(startGame, 5000);
    countOutRef.current = setTimeout(() => {
      setOpenModal(false);
      setStartGameLabel("Play Game");
      setIsNotPaired(true);
    }, 35000);
    setTimeout(function () {
      clearInterval(countRef.current);
    }, 30000);
  };

  const postMyMove = (e) => {
    if (!listOfMyMoves.length) {
      setValidMove(false);
      return;
    }
    setValidMove(true);
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
          resetBoard.map((m) => {
            document
              .getElementById(m.to)
              .appendChild(document.getElementById(m.piece));
          });
          clearInterval(getMoveRef.current);
          clearInterval(countRef.current);
          clearTimeout(countOutRef.current);
          setStartGameLabel("Play Game");
          setIsInChessGame(false);
          setIsNotPaired(null);
          setIsQuitGame(true);
          setMyGameID("");
          setListOfTheirMoves([]);
          secureLocalStorage.removeItem("gameID");
        });
    } else {
      alert("Something went wrong. Please try again");
    }
  };

  //   useEffect(() => {
  //     return () => {
  //         // Anything in here is fired on component unmount.
  //         if(isInChessGame){
  //           quitGame();
  //           console.log('quit')
  //         }
  //     };
  // }, [])

  const closeModal = (e) => {
    clearInterval(countRef.current);
    setOpenModal(false);
    quitGame();
    setStartGameLabel("Play Game");
  };

  const showRecentMove = (e) => {
    if (listOfTheirMoves.length) {
      listOfTheirMoves.map((m) => {
        document.getElementById(m.from).classList.add("box-from");
        document.getElementById(m.to).classList.add("box-to");
      });
    }
  };
  const unShowRecentMove = (e) => {
    if (listOfTheirMoves.length) {
      listOfTheirMoves.map((m) => {
        document.getElementById(m.from).classList.remove("box-from");
        document.getElementById(m.to).classList.remove("box-to");
      });
    }
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      console.log("quit");
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <div className="relative flex gap-[3rem] w-full h-full pt-[1rem] chessOnline-grid">
      {openModal && (
        <div className="myModal w-full h-full absolute  flex justify-center items-center bg-black/70">
          <div className="relative modalContent  md:w-[40%] w-[60%] h-[40%]  bg-[#fefefe] flex flex-col items-center justify-center rounded">
            <button
              className="absolute top-[1.5rem] right-[2rem]  text-[1.5rem]"
              onClick={closeModal}
            >
              <CgClose />
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
      {openHowToPlay && (
        <div className="absolute bg-black/70 w-full h-full flex justify-center items-center">
          <div className="relative bg-[#fefefe] rounded md:w-[60%] w-[80%] flex flex-col gap-[1rem]  rounded py-[1.5rem] px-[2.5rem]">
            <button
              className="absolute top-[1rem] right-[2rem]  text-[1.5rem]"
              onClick={(e) => setOpenHowToPlay(false)}
            >
              <CgClose />
            </button>
            <p>How to play:</p>
            <ul className="list-disc list-inside">
              <li>The rules follow the chess rules</li>
              <li>
                However, this chess game has no limitations nor restrictions on
                your play
              </li>
            </ul>
            <ul className="list-disc list-inside">
              <li>
                To send your move to the opponent, click on the Send Move button
              </li>
              <li>To reset your moves, click on the Reset Move button</li>
              <li>
                Once the opponent has made a move, it will automatically be
                reflected in your game
              </li>
              <li>
                To see your opponent's recent move, hover over the Previous Move
                button
              </li>
            </ul>
            <ul className="list-disc list-inside">
              <li>
                To capture an opponent, first drag the opponent's piece to the
                bin and then drag your piece onto the opponent's grid
              </li>
              <li>
                The two dashed grid at the edges of the grid are there for any
                castling moves
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="chessboard  h-full flex flex-col items-center">
        <div
          className={`chessboard-container  w-full grid grid-cols-10 auto-rows-fr border rounded-[0.5rem] ${
            !isInChessGame || !isMyturn ? "pointer-events-none" : ""
          }`}
          id="chessboard-temp"
        >
          <div
            className=" bg-chess-rim border-r-2 border-b-2 border-dashed rounded-tl-lg"
            id="fs1"
            onDrop={(e) => myDrop(e)}
            onDragOver={(e) => myDragOver(e)}
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
          <div className=" flex items-center justify-center text-[2em] bg-chess-rim rounded-tr-lg">
            <HiOutlineTrash
              id="bin1"
              onDrop={(e) => myDrop(e, "bin1")}
              onDragOver={(e) => myDragOver(e)}
            />
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

          <div className=" flex items-center justify-center text-[2em] bg-chess-rim rounded-bl-lg">
            <HiOutlineTrash
              id="bin2"
              onDrop={(e) => myDrop(e, "bin2")}
              onDragOver={(e) => myDragOver(e)}
            />
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
            onDrop={(e) => myDrop(e)}
            onDragOver={(e) => myDragOver(e)}
          ></div>
        </div>
      </div>
      <div className="chessboard-side  px-[2.5%] py-[2.5%] border rounded-[0.5rem] bg-[#EBECF0] flex flex-col gap-[0.3rem]">
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
          {isInChessGame && isMyturn && (
            <div className="flex items-center md:gap-x-[1.5rem] gap-x-[0.8rem]">
              <button
                className="border border-valid-green-light rounded px-[0.5em] py-[0.8em] bg-valid-green-light"
                id="sendMoveBtn"
                aria-label="Send Move"
                onClick={postMyMove}
              >
                Send my Move
              </button>
              <button
                className="border border-[#AAAAAA] rounded px-[0.5em] py-[0.8em] flex items-center gap-x-[0.5rem] bg-[#AAAAAA]"
                id="resetMoveBtn"
                aria-label="Reset Move"
                onClick={resetMyMove}
              >
                Reset Move
                <SlRefresh
                  className="text-[1.2rem] cursor-pointer"
                  aria-label="Reset your Move"
                />
              </button>
              <button
                className="border-[#4169e1] rounded bg-[#4169e1] hover:bg-[#4169e1]/70 px-[0.5em] py-[0.8em]"
                onMouseOver={showRecentMove}
                onMouseLeave={unShowRecentMove}
              >
                Previous Move
              </button>
            </div>
          )}

          {isInChessGame && (
            <button
              className="border border-error-red-dark rounded px-[0.5em] py-[0.8em] md:ml-0 ml-[0.8rem] bg-error-red-dark text-white"
              id="quitBtn"
              aria-label="Quit Game"
              onClick={quitGame}
            >
              Quit Game
            </button>
          )}
        </div>
        <div>
          <button
            className="border bg-my-black rounded px-[1.3em] py-[0.8em] text-white"
            onClick={(e) => setOpenHowToPlay(true)}
          >
            How to play
          </button>
        </div>
        <div>
          {isNotPaired && !isInChessGame && (
            <div className="border border-error-red-dark bg-error-red-light rounded px-[1rem] py-[1rem] mt-[2rem]">
              <p>There are currently no active opponents</p>
              <p>Please try again or come back later</p>
            </div>
          )}
          {isInChessGame && (
            <div className="flex flex-col gap-y-[1.5rem] mt-[2rem] border border-valid-green-dark bg-valid-green-light/80 rounded justify-center px-[1rem] py-[1rem]">
              <div id="gameStartData">
                <p>
                  You have been matched with user <b>{opponentPlayer}</b>
                </p>
                <p>
                  Your Pieces are <b>{myColor}</b>
                </p>
                <p>Good Luck!</p>
              </div>
              {whosTurn && isInChessGame && (
                <p className="text-center text-[1.25rem] font-bold">
                  {whosTurn}
                </p>
              )}
            </div>
          )}
          {!validMove && isInChessGame && (
            <div className="border border-error-red-dark bg-error-red-light rounded px-[1rem] py-[1rem] mt-[2rem]">
              <p>You have not made a move</p>
              <p>Please make a valid move and try again</p>
            </div>
          )}
          {opponentQuit && (
            <div className="border border-error-red-dark bg-error-red-light rounded px-[1rem] py-[1rem] mt-[2rem]">
              <p>Your Opponent left the game</p>
              <p>Start a new game</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGameServer;
