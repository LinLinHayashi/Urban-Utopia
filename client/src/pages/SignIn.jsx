import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'; 

export default function SignIn() {
  const [formData, setFormData] = useState({username: '', email: '', password: ''}); // The attributes must be intialized to prevent an uncaught JSON error, which can confuse you into thinking it's a Vite proxy error!
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.

    /* Code here seems unnecessary.
    try {
    */

      setLoading(true); // Data loading starts; the button is disabled.

      // Send a POST request to the URL with data and await the response, which will be stored in the "res" variable.
      const res = await fetch('/api/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // "data" is the response from the server, which is in JSON format.

      console.log(data);

      // If there is an error, as per the middleware for error handling we created in "index.js" in the backend.
      if (data.success === false) {
        setLoading(false); // Data loading completed; the button is enabled.
        setError(data.message); // "error" now stores the error message.
        return; // End "handleSubmit" function as we have an error.
      }

      // If we are here, then we are successfully signed in.
      setLoading(false); // Data loading completed; the button is enabled.
      setError(null); // Reset "error".
      navigate('/home'); // Navigate to home page after successfully signed in.

    /* Code here seems unnecessary.
    } catch (error) { // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false); // Data loading completed; the button is enabled.
      setError(error.message); // This is the error NOT defined in the backend.
    }
    */

  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

