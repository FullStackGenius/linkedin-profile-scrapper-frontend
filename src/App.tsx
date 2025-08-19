import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';

import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';


import LinkedinProfile from './components/LinkedinProfile';
import Profile from './components/Profile';
import InfluencerFinders from './components/InfluencerFinders';
function App() {


const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
  return (
    <>
      <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        

         <Route
          path="/influencer-finder"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
               <InfluencerFinders />
            </ProtectedRoute>
          }
        />
        


         

         <Route
          path="/linkedin-profile-data"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LinkedinProfile />
            </ProtectedRoute>
          }
        />

           <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
      </Routes>
    </div>
    </>
  )
}

export default App
