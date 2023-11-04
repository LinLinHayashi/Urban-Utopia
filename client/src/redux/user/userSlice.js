import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false
};

// Create a slice called "userSlice" and define it. A slice is a part of the store.
const userSlice = createSlice({ 
  name: 'user', // The name of the state.
  initialState, // The initial value of the state.

  // Reducers are functions that describe how the state changes in response to actions. They take the current state and/or an action as arguments and return a new state.
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => { // Actions are JS objects.
      state.currentUser = action.payload; // "payload" is an optional attribute of an action, which is the value passed with the action. Another action attribute is "type".
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

/* Action creators and reducers:
1. ".actions" attribute of "userSlice" is an automatically generated object that contains action creators.
2. Action creators have the same names as the reducers and can be used to dispatch actions with the corresponding action types.
3. "userSlice.actions" will look like this:
   {
    signInStart: createAction('user/signInStart'),
    signInSuccess: createAction('user/signInSuccess'),
    signInFailure: createAction('user/signInFailure)
   }
*/
export const {signInStart, signInSuccess, signInFailure} = userSlice.actions; // Each of these three variables is an action creator now.

export default userSlice.reducer; // "default" means we can change its name when importing it in other files. 