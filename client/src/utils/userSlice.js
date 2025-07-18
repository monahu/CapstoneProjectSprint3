import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    authInitialized: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload
      state.authInitialized = true
    },
    removeUser: (state) => {
      state.data = null
      state.authInitialized = true
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true
    },
  },
})

export const { addUser, removeUser, setAuthInitialized } = userSlice.actions
export default userSlice.reducer
