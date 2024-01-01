import {FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {signOutUserSuccess} from '../redux/user/userSlice';

export default function Header() {
  const dispatch = useDispatch();

  // When the cookie has expired, the user will be signed out automatically.
  useEffect(() => {
    const cookieChecker = async () => {
      const res = await fetch('/api/auth/token');
      const data = await res.json();
      if (data === 'Token has expired!'){
        dispatch(signOutUserSuccess());
      }
    };
    cookieChecker();
  }, []);

  // Now "currentUser" variable will change following how "currentUser" attribute of "user" change, and "user" is in fact "userSlice" as defined.
  const {currentUser} = useSelector(state => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search); // "window.location" is an object that contains information about the current URL of the browser. ".search" property specifically retrieves the query string part of the URL, starting with the question mark (?).
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  
  // Changes of the URL search term will change the value of the search text input.  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Urban</span>
            <span className='text-slate-700'>Utopia</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
          <button>
            <FaSearch className='text-slate-600'/>
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? ( // If "currentUser" is not null, then we know some user has signed in (as defined in "userSlice.js"), so we show the user's photo.
              <img src={currentUser.avatar} alt='Profile' className='rounded-full h-7 w-7 object-cover' />
            ) : ( // If "currentUser" is null, then we know no user has signed in, so we show "Sign in".
              <li className='text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
