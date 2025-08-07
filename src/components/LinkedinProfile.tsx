import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useApi from '../services/useApi';
import Layout from './Layout';

const LinkedinProfile = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProfiles();
    }
  }, [isAuthenticated, navigate]);

  const fetchProfiles = async () => {
    try {
      const response = await callApi('get', '/linkedin-profiles-data');
      setProfiles(response.data.profiles || []);
    } catch (err) {
      console.error('Error fetching profiles', err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">LinkedIn Profiles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Avatar</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Headline</th>
                <th className="px-4 py-2">Connections</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Influence Score</th>
                <th className="px-4 py-2">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {profiles.map((profile: any, index: number) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={profile.profile_image_url}
                      alt={profile.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{profile.full_name}</td>
                  <td className="px-4 py-2">{profile.headline || '--'}</td>
                  <td className="px-4 py-2">{profile.connection_degree || '--'}</td>
                  <td className="px-4 py-2">{profile.company || '--'}</td>
                  <td className="px-4 py-2">{profile.job_title || '--'}</td>
                  <td className="px-4 py-2">{profile.location || '--'}</td>
                  <td className="px-4 py-2">
  {Math.round(
    (parseInt(profile.shared_connections?.match(/\d+/)?.[0] || '0') * 0.4) +
    (parseInt(profile.followers?.replace(/[^\d]/g, '') || '0') * 0.6)
  )}
</td>
                  <td className="px-4 py-2">
                    <a
                      href={profile.profile_url}
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
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default LinkedinProfile;
