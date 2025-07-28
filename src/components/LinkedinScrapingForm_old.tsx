import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from './reduxStore/authSlice';
import useApi from './Services/useApi';
import apiService from './Services/apiService';
const LinkedinScrapingForm = () => {


    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // ✅ Safe to navigate here
        }
    }, [isAuthenticated, navigate]);
    const { data, loading, error, callApi } = useApi();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        linkedinCookies: '',
        spreadsheetUrl: '',
    });
    const [errors, setErrors] = useState({
        linkedinCookies: '',
        spreadsheetUrl: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { linkedinCookies: '', spreadsheetUrl: '' };

        // Validate LinkedIn Cookies (required)
        if (!formData.linkedinCookies.trim()) {
            newErrors.linkedinCookies = 'LinkedIn cookies are required';
            isValid = false;
        }

        // Validate Spreadsheet URL (required and must be a valid URL)
        if (!formData.spreadsheetUrl.trim()) {
            newErrors.spreadsheetUrl = 'Spreadsheet URL is required';
            isValid = false;
        } else {
            try {
                new URL(formData.spreadsheetUrl);
            } catch {
                newErrors.spreadsheetUrl = 'Please enter a valid URL';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for the field being edited
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await callApi('post', '/scrapeLinkedIn', formData);
                console.log(response);
                // if (response.data.token) {
                //    dispatch(setAuth({ token: response.data.token, user: "userResponse" }));
                //   apiService.setAuthToken(response.data.token); // Store JWT token
                //   setName('');
                //   setEmail('');
                //   setPassword('');
                //   navigate('/dashboard'); // Redirect to dashboard
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
                    <div>
                        <label htmlFor="linkedinCookies" className="block text-sm font-medium text-gray-700">
                            LinkedIn Cookies
                        </label>
                        <textarea
                            id="linkedinCookies"
                            name="linkedinCookies"
                            value={formData.linkedinCookies}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.linkedinCookies ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter LinkedIn cookies"
                            rows={4}
                        />
                        {errors.linkedinCookies && (
                            <p className="mt-1 text-sm text-red-600">{errors.linkedinCookies}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="spreadsheetUrl" className="block text-sm font-medium text-gray-700">
                            Spreadsheet URL
                        </label>
                        <input
                            id="spreadsheetUrl"
                            name="spreadsheetUrl"
                            type="url"
                            value={formData.spreadsheetUrl}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.spreadsheetUrl ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter spreadsheet URL"
                        />
                        {errors.spreadsheetUrl && (
                            <p className="mt-1 text-sm text-red-600">{errors.spreadsheetUrl}</p>
                        )}
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Scraping...' : 'Scrap Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LinkedinScrapingForm