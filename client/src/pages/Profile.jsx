import {useDispatch, useSelector} from 'react-redux';
import {useRef, useState, useEffect} from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure} from '../redux/user/userSlice';
import {Link} from 'react-router-dom';

export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user); // "useSelector()" is used to read data from the store.

  /*
    This is how useRef Hook works:
    1. Assign "fileRef" to the <input /> of id "ref"; now "fileRef.current" is in fact this <input />.
    2. Set click event of <img /> to calling an function that also triggers a click event of "fileRef.current".
    3. Now clicking <img /> equals clicking the <input />.
  */
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);

  // State for file uploading progress.
  const [filePerc, setFilePerc] = useState(0);

  // State for file uploading errors.
  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState({});
  console.log(formData);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // Initialize the function so we can use it later in the file. "useDispatch()" is used to send data to the store.
  const dispatch = useDispatch();

  // Whenever "file" changes, if "file" is not undefined, then run handleFileUpload().
  useEffect( () => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // This function first uploads the image file to the Firebase storage and then downloads the image file from the Firebase storage to use it as the user's profile image.
  const handleFileUpload = (file) => {
    setFileUploadError(false);
    const storage = getStorage(app); // Set "storage" to the Firebase storage we've created.
    const fileName = new Date().getTime() + file.name; // Put the current time before the file name to prevent potential errors caused by same file names since by doing this we'll always have unique file names.
    const storageRef = ref(storage, fileName); // "storageRef" refers to a specific location in the Firebase Storage we've created identified by the file name.
    const uploadTask = uploadBytesResumable(storageRef, file); // "uploadTask" refers to the specific action of uploading the file to the Firebase Storage location.

    // This is how we show the uploading progress in percentage when the file is being uploaded.
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },

    // If error occurs during the file upload, set the upload error state to true.
    (error) => {
      setFileUploadError(true);
    },

    // Get the URL of the snapshot (which in fact is the image file) we just uploaded and set it as the "avatar" attribute of the form data, i.e., replace the user's profile image with the uploaded image.
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
        setFormData({...formData, avatar: downloadURL});
      });
    });

    setFileUploadError(false); // Reset "fileUploadError".
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.

    try {
      dispatch(updateUserStart()); // Data loading starts; the button is disabled.

      // Send a POST request to the URL with data and await the response, which will be stored in the "res" variable.
      const res = await fetch(`/api/user/update/${currentUser._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // "data" is the response from the server, which is in JSON format.

      // If there is an error, as per the middleware for error handling we created in "index.js" in the backend.
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return; // End "handleSubmit" function as we have an error.
      }

      // If we are here, then we are successfully updated.
      dispatch(updateUserSuccess(data)); // "data" is the User record of the user updated.

      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);    
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method: 'DELETE', // Note that the method is DELETE now.
      }); // Also note that there is no headers or body in the request.
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return; // End "handleDeleteUser" function as we have an error.
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Note that, as defined in this function, we first delete the cookie and then set the "currentUser" to null in the local storage when we sign out. This indicates that even though the cookie expires, since the current user's User record (without the password) is still stored in the "currentUser" in the local storage, we are still signed in unless we manually sign out by calling this function.
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data); // Note that "data" is an array of listings.
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async listingId => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,
      {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings(prev => prev.filter(listing => listing._id !== listingId));
    } catch (error){
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' id='ref'/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ?
          <span className='text-red-700'>Error image upload: image must be less than 2 MB</span> :
          filePerc > 0 && filePerc < 100 ?
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span> :
          filePerc === 100 ?
          <span className='text-green-700'>Image successfully uploaded!</span> :
          ''}
        </p>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
          create listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <div className='justify-start'>
          {!currentUser.isGoogle && (
            <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
          )}
        </div>
        <div className='justify-end'>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listing' : ''}</p>
      {userListings && userListings.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map(listing => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain' />
              </Link>
              <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
