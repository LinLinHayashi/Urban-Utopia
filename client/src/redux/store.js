import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';

export const store = configureStore({ // The "configureStore" function is used to configure and create a Redux store, which is a global state.
  reducer: {user: userReducer}, // "user" is the name of "userSlice"; "userReducer" is the reducers of "userSlice".

  // The "middleware" allows us to configure middleware that intercepts and handles actions before they reach the reducers. Here it configures the default middleware that Redux Toolkit provides, which sets the "serializableCheck" to false (which is often done during development). 
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })

});