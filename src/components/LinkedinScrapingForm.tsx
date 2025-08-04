import  { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setAuth } from './reduxStore/authSlice';
import useApi from '../services/useApi';

// import apiService from './Services/apiService';

const LinkedinScrapingForm = () => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const { data, loading, error, callApi } = useApi();
    
    // State for multiple LinkedIn profile URLs
    const [profileUrls, setProfileUrls] = useState<string[]>(['']);
    const [errors, setErrors] = useState<string[]>(['']);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Validate form inputs
    const validateForm = () => {
        let isValid = true;
        const newErrors = profileUrls.map((url) => {
            if (!url.trim()) {
                isValid = false;
                return 'LinkedIn profile URL is required';
            }
            try {
                const parsedUrl = new URL(url);
                if (!parsedUrl.href.startsWith('https://www.linkedin.com/in/')) {
                    isValid = false;
                    return 'Please enter a valid LinkedIn profile URL';
                }
                return '';
            } catch {
                isValid = false;
                return 'Please enter a valid URL';
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    // Handle change for a specific URL input
    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...profileUrls];
        newUrls[index] = value;
        setProfileUrls(newUrls);

        const newErrors = [...errors];
        newErrors[index] = '';
        setErrors(newErrors);
    };

    // Add a new URL input field
    const addUrlField = () => {
        setProfileUrls([...profileUrls, '']);
        setErrors([...errors, '']);
    };

    // Remove a URL input field
    const removeUrlField = (index: number) => {
        if (profileUrls.length > 1) {
            const newUrls = profileUrls.filter((_, i) => i !== index);
            const newErrors = errors.filter((_, i) => i !== index);
            setProfileUrls(newUrls);
            setErrors(newErrors);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Transform profileUrls into the required format: [{"url":"..."}, {"url":"..."}]
                const formattedUrls = profileUrls.map((url) => ({ url }));
                 console.log(formattedUrls);
               //  return false;
                const response = await callApi('post', '/scrapeBrightdata', { profileUrl : formattedUrls});
                console.log(response);
                // Uncomment if you need to handle token and redirect
                // if (response.data.token) {
                //     dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
                //     apiService.setAuthToken(response.data.token);
                //     navigate('/dashboard');
                // }
            } catch (err) {
                // Error is handled by useApi
            }
        }
    };

    return (
        
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">LinkedIn Data Collection Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {profileUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="flex-1">
                                <label htmlFor={`profileUrl-${index}`} className="block text-sm font-medium text-gray-700">
                                    LinkedIn Profile URL {index + 1}
                                </label>
                                <input
                                    id={`profileUrl-${index}`}
                                    name={`profileUrl-${index}`}
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleUrlChange(index, e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors[index] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="e.g., https://www.linkedin.com/in/username"
                                />
                                {errors[index] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[index]}</p>
                                )}
                            </div>
                            {profileUrls.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeUrlField(index)}
                                    className="mt-6 text-red-600 hover:text-red-800 focus:outline-none"
                                    title="Remove URL"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={addUrlField}
                            className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                        >
                            Add Another URL
                        </button>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Scraping...' : 'Scrap Now'}
                    </button>
                </form>
                 {data && data.message && <p className="text-green-500">{data.message}</p>}
                 {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
        
    );
};

export default LinkedinScrapingForm;