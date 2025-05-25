import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

const LOCAL_STORAGE_KEY = 'pdfgo_auth'

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    // On server, return default
    return { user: null, token: null }
  }
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved) as AuthState
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }
  return { user: null, token: null }
}

const initialState: AuthState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
