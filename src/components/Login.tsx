import { useEffect, useState } from 'react'
import useApi from '../services/useApi';
// import useApi from '../Services/useApi';
import apiService from '../services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../reduxStore/authSlice';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {

const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, loading, error, callApi } = useApi();
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);


useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // ✅ Safe to navigate here
    }
  }, [isAuthenticated, navigate]);
  


  // Redirect if already authenticated
  // if (isAuthenticated) {
  //   navigate('/dashboard');
  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await callApi('post', '/login', { email, password });
      console.log(response);
      if (response.data.token) {
         dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
        apiService.setAuthToken(response.data.token); // Store JWT token
        setEmail('');
        setPassword('');
        navigate('/dashboard'); // Redirect to dashboard
      }
    } catch (err) {
      // Error is handled by useApi
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {data && data.message && <p className="success">{data.message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <p className="mt-5 text-center text-sm text-gray-600">
          Need an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login