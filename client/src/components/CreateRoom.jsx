import React, { useEffect, useState } from 'react'

import { socket } from '../socket'
import useStore from '../../store/store'


const CreateRoom = () => {

    const { setRoomInfo, setUserInfo } = useStore()

    const [createRoomName, setCreateRoomName] = useState(null)
    const [createRoomPassword, setCreateRoomPassword] = useState(null)

    useEffect(() => {
        function onRoomCreated(roomData, userData) {
            setRoomInfo(roomData)
            setUserInfo(userData)
        }
        socket.on('roomCreated', onRoomCreated)

        return () => {
            socket.off('roomCreated', onRoomCreated)
        };
    })

    const handleCreateRoom = () => {
        socket.emit("createRoom", createRoomName, createRoomPassword)
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-3 h-screen">
                <h1 className="text-white text-center font-bold text-3xl">Create a new room</h1>
                <input
                    onChange={(e) => setCreateRoomName(e.target.value)}
                    type="text"
                    placeholder='Room name*'
                    className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full'
                />
                <input
                    onChange={(e) => setCreateRoomPassword(e.target.value)}
                    type="text" placeholder='Room password' className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full'
                />
                <button
                    onClick={handleCreateRoom}
                    className='p-2 rounded outline-0 bg-zinc-800 text-white lg:w-9/12 w-full'>
                    Create new room
                </button>
            </div>
        </>
    )
}

export default CreateRoom