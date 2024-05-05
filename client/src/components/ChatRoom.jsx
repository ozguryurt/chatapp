import React, { useState, useRef, useEffect } from 'react'

import useStore from '../../store/store'
import { socket } from '../socket'

const ChatRoom = () => {
  const { roomInfo, userInfo, setRoomInfo } = useStore()

  const roomMessageInput = useRef(null)
  const roomMessagesBox = useRef(null)

  const [sendMessage, setSendMessage] = useState(null)
  const [roomMessages, setRoomMessages] = useState([])

  useEffect(() => {
    function onMessageSent(socketId, message) {
      setRoomMessages(prevMessages => [...prevMessages, { userId: socketId, message: message }])
    }
    socket.on('messageSent', onMessageSent)

    function onRoomLeft() {
      setRoomInfo(null)
    }
    socket.on('roomLeft', onRoomLeft)

    return () => {
      socket.off('messageSent', onMessageSent)
      socket.off('roomLeft', onRoomLeft)
    };
  })

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomInfo)
  }

  const handleSendMessage = () => {
    socket.emit("sendMessage", roomInfo, sendMessage)
    roomMessageInput.current.value = ""
    roomMessagesBox.current.scrollIntoView()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      socket.emit("sendMessage", roomInfo, sendMessage)
      roomMessageInput.current.value = ""
      roomMessagesBox.current.scrollIntoView()
    }
  }

  return (
    <>
      <div className="h-screen container mx-auto py-5">
        <div className="flex flex-col justify-center items-center gap-y-1 h-2/6">
          <span className="text-white text-4xl font-bold">ROOM INFO</span>
          <span className='text-white'><b>ID:</b> {roomInfo?.id}</span>
          <span className='text-white'><b>Name:</b> {roomInfo?.name}</span>
          {
            roomInfo?.ownerId === userInfo && <span className='text-white'><b>Password:</b> {roomInfo?.password === null ? "Not specified" : roomInfo?.password}</span>
          }
          <span className='text-white'><b>Current member count:</b> {roomInfo?.users?.length}</span>
          <button
            onClick={handleLeaveRoom}
            className='p-2 rounded outline-0 bg-zinc-800 text-white font-bold'>
            Leave room
          </button>
        </div>
        <div className="flex flex-col h-4/6 gap-y-1">
          <div ref={roomMessagesBox} className="h-[90%] overflow-y-auto flex flex-col gap-y-1">
            {
              roomMessages?.map((msg, index) => {
                return <span key={index} className='text-white bg-zinc-800 rounded p-1'>
                  <b>{msg.userId}</b><br />
                  {msg.message}
                </span>
              })
            }
          </div>
          <div className="h-[10%] flex gap-1">
            <input
              ref={roomMessageInput}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSendMessage(e.target.value)}
              type="text"
              placeholder={`Send message as ${userInfo}`}
              className='p-2 rounded outline-0 bg-zinc-800 text-white w-3/4'
            />
            <button
              onClick={handleSendMessage}
              className='p-2 rounded outline-0 bg-zinc-800 text-white w-1/4'>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatRoom