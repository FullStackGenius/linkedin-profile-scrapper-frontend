import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reduxStore/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="text-white text-2xl font-bold">
          <NavLink to="/" className="hover:text-gray-300">
            LinkedIn Data Scrapper
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            Home
          </NavLink>
          {/* <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            About
          </NavLink> */}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Dashboard
              </NavLink>

               <NavLink
                to="/b2b-influencer-finder"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                B2B Influencer Finder
              </NavLink>
               <NavLink
                to="/get-linkedin-profile"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Linkedin Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Sign up
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;