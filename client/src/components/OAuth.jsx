import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase';
import {useDispatch} from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';

export default function OAuth() {

  // Initialize the functions so we can use them later in the file.
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Create a Google authentication provider.
      const auth = getAuth(app); // Create an authentication config using the Firebase setup in "firebase.js".

      // This will create a pop-up sign-in page using the authentication provider and config; the authenticated info (here is a Google account info) will be stored in "result".
      const result = await signInWithPopup(auth, provider);

      // Through this, we note that "result" has a bunch of attributes involving "user.displayName", "user.email", and "user.photoURL". We'll fetch info of these attributes from the server next.
      console.log(result);

      // Send a POST request to the URL with data and await the response, which will be stored in the "res" variable.
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
      });

      const data = await res.json(); // "data" is the response from the server, which is in JSON format.

      // Dispatch the action to update the 'user' state (i.e., slice) with 'data'.
      dispatch(signInSuccess(data));

      navigate('/');

    } catch(error) {
      console.log('Could not sign in with Google', error);
    }
  };

  return (
    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95' type='button' onClick={handleGoogleClick}>Continue with Google</button>
  );
}
