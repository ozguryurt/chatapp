import React, { useEffect, useState } from 'react'

import { socket } from '../socket'
import useStore from '../../store/store'

const JoinRoom = () => {

    const { setRoomInfo, setUserInfo } = useStore()

    const [joinRoomID, setJoinRoomID] = useState(-1)
    const [joinRoomPassword, setJoinRoomPassword] = useState(null)

    useEffect(() => {
        function onRoomJoined(roomData, userData) {
            setRoomInfo(roomData)
            setUserInfo(userData)
        }
        socket.on('roomJoined', onRoomJoined)

        return () => {
            socket.off('roomJoined', onRoomJoined)
        };
    })

    const handleJoinRoom = () => {
        socket.emit("joinRoom", joinRoomID, joinRoomPassword)
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-y-3 min-h-screen">
                <h1 className="text-white text-center font-bold text-3xl">Join a room</h1>
                <input onChange={(e) => setJoinRoomID(e.target.value)} type="text" placeholder='Room ID*' className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full' />
                <input onChange={(e) => setJoinRoomPassword(e.target.value)} type="text" placeholder='Room password' className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full' />
                <button onClick={handleJoinRoom} className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full'>Join room</button>
            </div>
        </>
    )
}

export default JoinRoom