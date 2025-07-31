import  { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setAuth } from './reduxStore/authSlice';
import useApi from '../services/useApi';
// import apiService from './Services/apiService';

const GetAllLinkedinProfile = () => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const {  callApi } = useApi();
       const [profiles, setProfiles] = useState([]);
    
    // State for multiple LinkedIn profile URLs
    // const [profileUrls, setProfileUrls] = useState<string[]>(['']);
    // const [errors, setErrors] = useState<string[]>(['']);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        fetchProfiles();
    }, [isAuthenticated, navigate]);

  
 

    // Handle form submission
    const fetchProfiles = async () => {
       
            try {
               
                const response = await callApi('get', '/getAllLinkedinProfiles');
                // console.log(response.data.profiles);
                 setProfiles(response.data.profiles);
               
            } catch (err) {
                // Error is handled by useApi
            }
       
    };

    return (
        <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">LinkedIn Profiles</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
               <th className="px-4 py-2">Connections</th>
                <th className="px-4 py-2">Followers</th>
                <th className="px-4 py-2">Influence Score</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {profiles.map((profile: any, index: number) => (
              <tr key={profile.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 font-medium">{profile.name}</td>
                <td className="px-4 py-2">{profile.position || '--'}</td>
                <td className="px-4 py-2">{profile.connections || '--'}</td>
                <td className="px-4 py-2">{profile.followers || '--'}</td>
                <td className="px-4 py-2">
                {Math.round(
                    (Number(profile.followers || 0) * 0.6) +
                    (Number(profile.connections || 0) * 0.4)
                )}
                </td>
                <td className="px-4 py-2">{profile.location}</td>
                <td className="px-4 py-2">{profile.current_company_name || '--'}</td>
                <td className="px-4 py-2">
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default GetAllLinkedinProfile;