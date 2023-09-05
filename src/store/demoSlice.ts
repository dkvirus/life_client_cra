import { createSlice } from '@reduxjs/toolkit'

export interface DemoState {
    name: string;
}

const initialState: DemoState = {
  name: 'dmeo',
}

export const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    updateName(state, action) {     
      state.name = action.payload
    },
  },
})

export const {
  updateName,
} = demoSlice.actions

export const getName = (state) => state.demo.name

export default demoSlice.reducer
