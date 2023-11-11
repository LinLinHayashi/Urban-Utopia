import {useDispatch, useSelector} from 'react-redux';
import {useRef, useState, useEffect} from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import {updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/user/userSlice';

export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);

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

  // Initialize the functions so we can use them later in the file.
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
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  );
}
