// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import useApi from '../services/useApi';
// import Layout from './Layout';

// const LinkedinProfile = () => {
//   const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
//   const navigate = useNavigate();
//   const { callApi } = useApi();
//   const [profiles, setProfiles] = useState([]);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else {
//       fetchProfiles();
//     }
//   }, [isAuthenticated, navigate]);

//   const fetchProfiles = async () => {
//     try {
//       const response = await callApi('get', '/linkedin-profiles-data');
//       setProfiles(response.data.profiles || []);
//     } catch (err) {
//       console.error('Error fetching profiles', err);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h2 className="text-2xl font-semibold mb-4">LinkedIn Profiles</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
//             <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
//               <tr>
//                 <th className="px-4 py-2">#</th>
//                 <th className="px-4 py-2">Avatar</th>
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Headline</th>
//                 <th className="px-4 py-2">Connections</th>
//                 <th className="px-4 py-2">Company</th>
//                 <th className="px-4 py-2">Job Title</th>
//                 <th className="px-4 py-2">Location</th>
//                 <th className="px-4 py-2">Influence Score</th>
//                 <th className="px-4 py-2">Profile</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 text-sm">
//               {profiles.map((profile: any, index: number) => (
//                 <tr key={profile.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2">
//                     <img
//                       src={profile.profile_image_url}
//                       alt={profile.full_name}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-4 py-2 font-medium">{profile.full_name}</td>
//                   <td className="px-4 py-2">{profile.headline || '--'}</td>
//                   <td className="px-4 py-2">{profile.connection_degree || '--'}</td>
//                   <td className="px-4 py-2">{profile.company || '--'}</td>
//                   <td className="px-4 py-2">{profile.job_title || '--'}</td>
//                   <td className="px-4 py-2">{profile.location || '--'}</td>
//                   <td className="px-4 py-2">
//   {Math.round(
//     (parseInt(profile.shared_connections?.match(/\d+/)?.[0] || '0') * 0.4) +
//     (parseInt(profile.followers?.replace(/[^\d]/g, '') || '0') * 0.6)
//   )}
// </td>
//                   <td className="px-4 py-2">
//                     <a
//                       href={profile.profile_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//               {profiles.length === 0 && (
//                 <tr>
//                   <td colSpan={9} className="text-center py-4 text-gray-500">
//                     No profiles found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default LinkedinProfile;


import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useApi from '../services/useApi';
import Layout from './Layout';

interface Profile {
  id: string;
  profile_image_url: string;
  full_name: string;
  headline: string;
  connection_degree: string;
  company: string;
  job_title: string;
  location: string;
  shared_connections: string;
  followers: string;
  profile_url: string;
}

const LinkedinProfile = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [profiles, setProfiles] = useState<Profile[]>([]);

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
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">LinkedIn Profiles</h2>
          {profiles.length > 0 ? (
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
                        alt={`${profile.full_name}'s profile`}
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
                        href={profile.profile_url}
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
          ) : (
            <p className="text-center text-gray-600 text-lg">No profiles found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LinkedinProfile;
