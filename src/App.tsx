import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import About from './components/About';
import GetAllLinkedinProfile from './components/GetAllLinkedinProfile';
import B2BInfluencerFinder from './components/B2BInfluencerFinder';
function App() {

//const isAuthenticated = false; // Replace with your auth logic
const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
  return (
    <>
      <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/b2b-influencer-finder"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <B2BInfluencerFinder />
            </ProtectedRoute>
          }
        />
         <Route
          path="/get-linkedin-profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GetAllLinkedinProfile />
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
