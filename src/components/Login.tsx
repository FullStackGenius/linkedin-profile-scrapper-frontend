import { useEffect, useState } from 'react'
import useApi from '../services/useApi';
// import useApi from '../Services/useApi';
import apiService from '../services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../reduxStore/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Layout from './Layout';
const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, loading, error, callApi } = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/influencer-finder'); // ✅ Safe to navigate here
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
      // console.log(response);
      if (response.data.token) {
        dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
        apiService.setAuthToken(response.data.token); // Store JWT token
        setEmail('');
        setPassword('');
        navigate('/influencer-finder'); // Redirect to dashboard
      }
    } catch (err) {
      // Error is handled by useApi
    }
  };


  const handleGoogleLogin = async (credentialResponse: any) => {
    // console.log(credentialResponse);
    try {
      const response = await callApi('post', '/google-login', {
        token: credentialResponse.credential,
      });
      if (response.data.token) {
        dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
        apiService.setAuthToken(response.data.token);
        navigate('/influencer-finder');
      }
    } catch (err) {
      // Error is handled by useApi
    }
  };

  return (
     <Layout>
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
            className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              // console.error('Google Login Failed');
            }}
            theme="filled_blue"
            size="large"
            width="100%"
          />
        </div>
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
     </Layout>
  )
}

export default Login