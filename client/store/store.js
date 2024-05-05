import { create } from 'zustand'

const useStore = create((set) => ({
    roomInfo: null,
    setRoomInfo: (newRoomInfo) => set({ roomInfo: newRoomInfo }),
    userInfo: null,
    setUserInfo: (newUserInfo) => set({ userInfo: newUserInfo })
}))

export default useStore;