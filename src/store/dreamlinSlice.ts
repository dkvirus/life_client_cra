import { createSlice } from '@reduxjs/toolkit'

export interface DreamlinState {
    name: string;
    dreamlinGood: {
      apiData: any;
      skusData: any[];
    },
}

const initialState: DreamlinState = {
  name: 'dreamlin',
  dreamlinGood: {
    apiData: [],
    skusData: [],
  },
}

export const dreamlinSlice = createSlice({
  name: 'dreamlin',
  initialState,
  reducers: {
    updateName(state, action) {     
      state.name = action.payload
    },
    updatePageData(state, action) {
      state[action.payload.pageName] = {
        ...state[action.payload.pageName],
        ...action.payload.payload,
      }
    },
  },
})

export const {
  updateName,
  updatePageData,
} = dreamlinSlice.actions

export const getName = (state) => state.dreamlin.name
export const selectPageData = (state) => state.dreamlin

export default dreamlinSlice.reducer
