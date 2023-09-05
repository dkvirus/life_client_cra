import { configureStore } from '@reduxjs/toolkit'
import { demoSlice } from './demoSlice'

export const store = configureStore({
  reducer: {
      [demoSlice.name]: demoSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
})
