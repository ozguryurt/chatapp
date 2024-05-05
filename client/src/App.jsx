import React, { useEffect } from 'react';
import './App.css'

import { socket } from './socket';
import useStore from '../store/store';

import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';

function App() {
  const { roomInfo, setRoomInfo, setUserInfo } = useStore()

  useEffect(() => {
    function onError(data) {
      alert(data.message)
      setRoomInfo(null)
      setUserInfo(null)
    }
    socket.on('error', onError)

    function onUpdateRoom(roomInfo) {
      setRoomInfo(roomInfo)
    }
    socket.on('updateRoom', onUpdateRoom)

    return () => {
      socket.off('error', onError)
      socket.off('updateRoom', onUpdateRoom)
    };
  }, []);

  return (
    <>
      {
        roomInfo !== null ?
          <>
            <ChatRoom/>
          </>
          :
          <>
            <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen">
              <CreateRoom />
              <JoinRoom />
            </div>
          </>
      }
    </>
  );
}

export default App;
