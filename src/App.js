
import { useState, useEffect } from 'react';
import  secureLocalStorage  from  "react-secure-storage";
import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Shop from './components/Shop';
import GuestBook from './components/GuestBook';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [openTab, setOpenTab]=useState('home');
  const [signedOn, setSignedOn] = useState(false);

  const checkSignedOn = (e) =>{
    if (secureLocalStorage.getItem("state")){
      setSignedOn(true);

    }
  }
  const handleActiveTabChange =(tab)=>{
    setOpenTab(tab);
  }
  useEffect(()=>{
    checkSignedOn();
  },[{signedOn}])
  return (
    <div className="App h-screen w-screen">
      <NavBar handleActiveTabChange={handleActiveTabChange} signedOn={signedOn} setSignedOn={setSignedOn}/>
      {openTab == 'home' ? <Home />: '' }
      {openTab == 'shop' ? <Shop /> : ''}
      {openTab == 'game' ? <Game signedOn={signedOn}/> : ''}
      {openTab == 'guest' ? <GuestBook /> : ''}
      {openTab == 'login' ? <Login handleActiveTabChange={handleActiveTabChange} signedOn={signedOn} setSignedOn={setSignedOn}/> : ''}
    


    </div>
  );
}

export default App;
