import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useApi from '../services/useApi';
import Layout from './Layout';

interface Profile {
  id: number;
  profile_image_url: string;
  full_name: string | null;
  headline: string | null;
  connection_degree: string | null;
  company: string | null;
  job_title: string | null;
  location: string | null;
  shared_connections: string | null;
  followers: string | null;
  profile_url: string | null;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
  };
}

const LinkedinProfile: React.FC = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(15); // Match the limit from the API response

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProfiles(currentPage);
    }
  }, [isAuthenticated, navigate, currentPage]);

  const fetchProfiles = async (page: number) => {
    try {
      const response = await callApi('get', `/linkedin-profiles-data?page=${page}&limit=${limit}`);
      const data = response as ApiResponse;
      setProfiles(data.data.profiles || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      console.error('Error fetching profiles', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(total / limit)) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">LinkedIn Profiles</h2>
          {profiles.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <div
                    key={profile.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="flex items-start space-x-4">
                      {profile.profile_image_url && (
                        <img
                          src={profile.profile_image_url}
                          alt={`${profile.full_name || 'User'}'s profile`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {profile.full_name || '--'}
                          </h3>
                          <span className="text-sm text-gray-500 font-medium">#{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{profile.headline || '--'}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {profile.job_title || '--'} at{' '}
                          <span className="text-indigo-500">{profile.company || '--'}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{profile.location || '--'}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {profile.connection_degree || '--'}
                          {profile.shared_connections && ` • ${profile.shared_connections}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Influence Score:{' '}
                          {Math.round(
                            (parseInt(profile.shared_connections?.match(/\d+/)?.[0] || '0') * 0.4) +
                            (parseInt(profile.followers?.replace(/[^\d]/g, '') || '0') * 0.6)
                          )}
                        </p>
                        <a
                          href={profile.profile_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">No profiles found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LinkedinProfile;