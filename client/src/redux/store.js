import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Create a root reducer that delegates specified reducers of states; here we only hava the reducers of "user" state. (a state is a slice.)
const rootReducer = combineReducers({user: userReducer}); // "user" is the name of "userSlice"; "userReducer" is the reducers of "userSlice".

const persistConfig = {
  key: 'root', // An arbitrary value for reference.
  storage, // The state will be stored in the local storage.
  version: 1 // An arbitrary value for reference.
};

// Set all root reducer's "slave" reducers to storing their states in the local storage; now this newly set "master" reducer is "persistedReducer".
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ // The "configureStore" function is used to configure and create a Redux store, which is a global state.
  reducer: persistedReducer,

  // The "middleware" allows us to configure middleware that intercepts and handles actions before they reach the reducers. Here it configures the default middleware that Redux Toolkit provides, which sets the "serializableCheck" to false (which is often done during development). 
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })

});

// Create an enhanced store from the current store. When the pages start or reload, the enhanced store will automatically rehydrate all states from the local storage specified in "persistConfig".
export const persistor = persistStore(store); // Export "persistor" to be used in "main.jsx".