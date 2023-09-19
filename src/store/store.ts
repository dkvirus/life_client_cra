import { configureStore } from '@reduxjs/toolkit'
import { demoSlice } from './demoSlice'
import { dreamlinSlice } from './dreamlinSlice'

export const store = configureStore({
  reducer: {
      [demoSlice.name]: demoSlice.reducer,
      [dreamlinSlice.name]: dreamlinSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
})
