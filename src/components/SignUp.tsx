import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from './reduxStore/authSlice';
import useApi from './Services/useApi';
import apiService from './Services/apiService';

const SignUp = () => {

   const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
const navigate = useNavigate();
useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // ✅ Safe to navigate here
    }
  }, [isAuthenticated, navigate]);

    const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const { data, loading, error, callApi } = useApi();
    const dispatch = useDispatch();
  
      const handleSubmit = async (e: any) => {
          e.preventDefault();
          try {
            const response = await callApi('post', '/register', {name, email, password });
            console.log(response);
            if (response.data.token) {
               dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
              apiService.setAuthToken(response.data.token); // Store JWT token
              setName('');
              setEmail('');
              setPassword('');
              navigate('/dashboard'); // Redirect to dashboard
            }
          } catch (err) {
            // Error is handled by useApi
          }
        };
  return (
    <>
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
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
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Login 
          </a>
        </p>
      </div>
    </div>
    </>
  )
}

export default SignUp