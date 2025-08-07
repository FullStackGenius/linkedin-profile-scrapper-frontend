import React, { useState } from 'react';
import type { FormEvent } from 'react';
import useApi from '../services/useApi';
import Layout from './Layout';


interface FormData {
    keyword: string;
    linkedinCookie: string;
    industry: string[];
    language: string[];
}

const InfluencerFinder: React.FC = () => {
    //  data, loading, error,
    const { data, error, loading, callApi } = useApi();
    const [formData, setFormData] = useState<FormData>({
        keyword: '',
        linkedinCookie: 'AQEDASg3OocBn8F9AAABly-R_ckAAAGYpvlHRk0Ax8SRkC6NJfR92gVHpCjMP0ppObnILXFqDJKOepHZn9tcJXZ_0hAcyipWbRcWaG4W32CugBbz_I6SzClQXufxShU2kBky57LP6bLuBx0Jdr37gfWI',
        industry: [],
        language: [],
    });
    const [results, setResults] = useState([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, options } = e.target as HTMLSelectElement;
        if (name === 'industry' || name === 'language') {
            const selectedValues = Array.from(options)
                .filter((option) => option.selected)
                .map((option) => option.value);
            setFormData((prev) => ({ ...prev, [name]: selectedValues }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();






        // Construct dynamic URL with query parameters
        const baseUrl = 'https://www.linkedin.com/search/results/people/';
        const params = new URLSearchParams();
        if (formData.industry.length > 0) {
            params.append('industry', JSON.stringify(formData.industry));
        }

        if (formData.language.length > 0) {
            params.append('profileLanguage', JSON.stringify(formData.language));
        }

        // if (formData.industry.length > 0) {
        //   params.append('industry', `[${formData.industry.join(',')}]`);
        // }
        // if (formData.language.length > 0) {
        //   params.append('profileLanguage', `[${formData.language.join(',')}]`);
        // }
        if (formData.keyword.trim()) {
            params.append('keywords', formData.keyword.trim());
        }

        const dynamicUrl = `${baseUrl}?${params.toString()}`;
        // console.log('Redirecting to:', dynamicUrl);
        //console.log(formData.linkedinCookie.trim());
        //return;

        try {
            //    let sessionCookie = 'AQEDASg3OocBn8F9AAABly-R_ckAAAGYpvlHRk0Ax8SRkC6NJfR92gVHpCjMP0ppObnILXFqDJKOepHZn9tcJXZ_0hAcyipWbRcWaG4W32CugBbz_I6SzClQXufxShU2kBky57LP6bLuBx0Jdr37gfWI';
            const response = await callApi('post', '/phantombuster-scraping', {
                linkedInSearchUrl: dynamicUrl, sessionCookie:
                    formData.linkedinCookie.trim()
            });
            // console.log(response);
            if (response.status) {
                setResults(response.data);
                console.log(response);

                //navigate('/dashboard'); // Redirect to dashboard
            }
        } catch (err) {
            console.log(err)
            // Error is handled by useApi
        }


        // window.open(dynamicUrl, '_blank', 'noopener,noreferrer');
        //window.location.href = dynamicUrl; // Redirect to the constructed URL
    };

    return (
        <Layout>
        {results.length < 1 &&    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Influencer Finder</h2>
                    <p className="text-gray-600 text-center mb-6">Find relevant LinkedIn profiles based on search criteria.</p>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">LinkedIn Cookie</label>
                            <input
                                type="text"
                                name="linkedinCookie"
                                readOnly
                                value={formData.linkedinCookie}
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your LinkedIn cookie"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keyword to Search</label>
                            <input
                                type="text"
                                name="keyword"
                                value={formData.keyword}
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter keyword"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Industry</label>
                            <select
                                name="industry"
                                multiple
                                value={formData.industry}
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-24"
                                size={5}
                            >
                                <option value="">Select Industries</option>
                                <option value="1810">Professional Services</option>
                                <option value="11">Business Consulting and Services</option>
                                <option value="86">Environmental Services</option>
                                <option value="25">Manufacturing</option>
                                <option value="55">Machinery Manufacturing</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Hold <span className="font-semibold">Ctrl</span> (or <span className="font-semibold">Cmd</span> on Mac) and click to select multiple options.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Language</label>
                            <select
                                name="language"
                                multiple
                                required
                                value={formData.language}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-24"
                                size={5}
                            >
                                <option value="">Select Languages</option>
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                                <option value="pt">Portuguese</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Hold <span className="font-semibold">Ctrl</span> (or <span className="font-semibold">Cmd</span> on Mac) and click to select multiple options.
                            </p>
                        </div>
                        {data && data.message && <p className="success">{data.message}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full flex justify-center bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            
                           {loading ? 'Scraping.. ' : 'Scrap now'} 
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



                    {/* {results.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Results</h2>
                <div className="grid gap-4">
                  {results.map((profile, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-start space-x-4"
                    >
                      {profile.profileImageUrl && (
                        <img
                          src={profile.profileImageUrl}
                          alt={`${profile.fullName}'s profile`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          <a
                            href={profile.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.fullName}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-600">{profile.headline}</p>
                        <p className="text-sm text-gray-500">
                          {profile.jobTitle} at{' '}
                          <a
                            href={profile.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.company}
                          </a>
                        </p>
                        <p className="text-sm text-gray-500">{profile.location}</p>
                        {profile.sharedConnections && (
                          <p className="text-sm text-gray-500">{profile.sharedConnections}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}


                </div>
            </div> }
        {results.length > 0 &&   <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                        LinkedIn Search Results
                    </h1>
                    <button
  onClick={() => {
    setResults([]);          // Clear the results array
    // window.history.back();   // Navigate back
  }}
  className="inline-flex items-center px-4 py-2 mb-6 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
>
  ← Back To Influencer Finder
</button>
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((profile:any, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                                >
                                    <div className="flex items-start space-x-4">
                                        {profile.profileImageUrl && (
                                            <img
                                                src={profile.profileImageUrl}
                                                alt={`${profile.fullName}'s profile`}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                <a
                                                    href={profile.profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-600 transition-colors duration-200"
                                                >
                                                    {profile.fullName}
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{profile.headline}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {profile.jobTitle} at{' '}
                                                <a
                                                    href={profile.companyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {profile.company}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">{profile.location}</p>
                                            {profile.sharedConnections && (
                                                <p className="text-sm text-gray-400 mt-1">{profile.sharedConnections}</p>
                                            )}
                                            <a
                                                href={profile.profileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                View Profile
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 text-lg">No results found.</p>
                    )}
                </div>
            </div>  }
        </Layout>
    );
};

export default InfluencerFinder;