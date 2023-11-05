import {useSelector} from "react-redux";
import {Outlet, Navigate} from 'react-router-dom';

export default function PrivateRoute() {

  // Now "currentUser" variable will change following how "currentUser" attribute of "user" change, and "user" is in fact "userSlice" as defined.
  const {currentUser} = useSelector(state => state.user);

  // If some user has signed in, render nested child routes; otherwise, navigate to "/sign-in".
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
