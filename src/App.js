
import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import  secureLocalStorage  from  "react-secure-storage";
import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Shop from './components/Shop';
import GuestBook from './components/GuestBook';
import Login from './components/Login';
import Game from './components/Game';
import ChessGameServer from './components/ChessGameServer';

function App() {
  
  const [signedOn, setSignedOn] = useState(false);

  const checkSignedOn = (e) =>{
    if (secureLocalStorage.getItem("state")){
      setSignedOn(true);

    }
  }
  useEffect(()=>{
    checkSignedOn();
  },[{signedOn}])

  let isViewTransition =
    "Opss, Your browser doesn't support View Transitions API";
  if (document.startViewTransition) {
    isViewTransition = "Yess, Your browser support View Transitions API";
  }
  return (
    <div className="App h-screen w-screen">
      <NavBar signedOn={signedOn} setSignedOn={setSignedOn}/>

      <Routes>
        {/* Routes */}
        <Route path="/" element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="game" element={<Game signedOn={signedOn}/>} >
          {/* 2nd Level Navigation Routes */}
          <Route path="/game" element={<Game />} />
          <Route path="onlineChess" element={<ChessGameServer signedOn={signedOn}/>} />
        </Route>
        <Route path="guestbook" element={<GuestBook /> } />
        <Route path="login" element={<Login signedOn={signedOn} setSignedOn={setSignedOn}/> } />

        {/* 404 page */}
        {/* <Route path="*" element={<PageNotFound />} /> */}




      </Routes>
    


    </div>
  );
}

export default App;
