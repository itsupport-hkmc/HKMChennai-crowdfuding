import {configureStore} from '@reduxjs/toolkit'
import clientUserReducer from './clientSlices/clientUsers';
import adminReducer from './adminSlice/adminSlice'
const store = configureStore({
    reducer:{
      clientUsers : clientUserReducer,
      admin : adminReducer
    }
})

export default store