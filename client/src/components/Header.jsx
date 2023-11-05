import {FaSearch} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header() {

  // Now "currentUser" variable will change following how "currentUser" attribute of "user" change, and "user" is in fact "userSlice" as defined.
  const {currentUser} = useSelector(state => state.user);
  
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Business</span>
            <span className='text-slate-700'>Site</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
          <FaSearch className='text-slate-600'/>
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
