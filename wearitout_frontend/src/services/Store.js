import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './Reducer';


export const store = configureStore({
  reducer: {
    order: orderReducer
  },
});

export default store;
