import React, { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import useApi from '../services/useApi';
import Layout from './Layout';

// SelectBox Component
interface SelectBoxProps {
    name: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (name: string, values: string[]) => void;
    error?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({ name, options, selectedValues, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectBoxRef = useRef<HTMLDivElement>(null);

    // Map selected values to their corresponding labels
    const selectedLabels = selectedValues
        .map((value) => options.find((option) => option.value === value)?.label || value)
        .filter((label) => label !== '');

    // Handle clicks outside the SelectBox to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value];
        onChange(name, newValues);
    };

    return (
        <div className="relative w-full" ref={selectBoxRef}>
            <button
                type="button"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                onClick={handleToggle}
            >
                {selectedLabels.length > 0 ? selectedLabels.join(', ') : `Select ${name}`}
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                                {selectedValues.includes(option.value) && (
                                    <span className="text-green-500 ml-2">✔</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <input type="hidden" name={name} value={selectedValues.join(',')} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

interface FormData {
    keyword: string;
    linkedinCookie: string;
    industry: string[];
    language: string[];
}

const InfluencerFinders: React.FC = () => {
    const { data, error: apiError, loading, callApi } = useApi();
    const [formData, setFormData] = useState<FormData>({
        keyword: '',
        linkedinCookie: 'AQEDASg3OocBn8F9AAABly-R_ckAAAGYpvlHRk0Ax8SRkC6NJfR92gVHpCjMP0ppObnILXFqDJKOepHZn9tcJXZ_0hAcyipWbRcWaG4W32CugBbz_I6SzClQXufxShU2kBky57LP6bLuBx0Jdr37gfWI',
        industry: [],
        language: [],
    });
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const maxPages = 10;

    const industryOptions = [
        { value: '1810', label: 'Professional Services' },
        { value: '11', label: 'Business Consulting and Services' },
        { value: '86', label: 'Environmental Services' },
        { value: '25', label: 'Manufacturing' },
        { value: '55', label: 'Machinery Manufacturing' },
    ];

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'de', label: 'German' },
        { value: 'pt', label: 'Portuguese' },
    ];

    const handleChange = (name: string, values: string[]) => {
        setFormData((prev) => ({ ...prev, [name]: values }));
        setErrors((prev) => ({
            ...prev,
            [name]: values.length === 0 ? `At least one ${name} must be selected` : '',
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '',
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (formData.keyword.trim() === '') {
            newErrors.keyword = 'Keyword is required';
        }
        if (formData.linkedinCookie.trim() === '') {
            newErrors.linkedinCookie = 'LinkedIn Cookie is required';
        }
        if (formData.industry.length === 0) {
            newErrors.industry = 'At least one industry must be selected';
        }
        if (formData.language.length === 0) {
            newErrors.language = 'At least one language must be selected';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const constructUrl = (pageNum: number) => {
        const baseUrl = 'https://www.linkedin.com/search/results/people/';
        const params = new URLSearchParams();
        if (formData.industry.length > 0) {
            params.append('industry', JSON.stringify(formData.industry));
        }
        if (formData.language.length > 0) {
            params.append('profileLanguage', JSON.stringify(formData.language));
        }
        if (formData.keyword.trim()) {
            params.append('keywords', formData.keyword.trim());
        }
        params.append('page', pageNum.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const handleSearch = async (e: FormEvent, pageNum: number = 1) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const dynamicUrl = constructUrl(pageNum);
        // return;
        try {
            const response = await callApi('post', '/phantombuster-scraping', {
                linkedInSearchUrl: dynamicUrl,
                sessionCookie: formData.linkedinCookie.trim(),
            });
            if (response.status) {
                setResults((prev) => (pageNum === 1 ? response.data : [...prev, ...response.data]));
                console.log(response);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleLoadMore = () => {
        if (page < maxPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            handleSearch({ preventDefault: () => { } } as FormEvent, nextPage);
        }
    };

    return (
        <Layout>
            {results.length < 1 && (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Influencer Finder</h2>
                        <p className="text-gray-600 text-center mb-6">Find relevant LinkedIn profiles based on search criteria.</p>
                        <form onSubmit={(e) => handleSearch(e, 1)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Keyword to Search</label>
                                <input
                                    type="text"
                                    name="keyword"
                                    value={formData.keyword}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.keyword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter keyword"
                                />
                                {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <SelectBox
                                    name="industry"
                                    options={industryOptions}
                                    selectedValues={formData.industry}
                                    onChange={handleChange}
                                    error={errors.industry}
                                />
                                <p className="text-sm text-gray-500 mt-1">Click to select multiple industries.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Language</label>
                                <SelectBox
                                    name="language"
                                    options={languageOptions}
                                    selectedValues={formData.language}
                                    onChange={handleChange}
                                    error={errors.language}
                                />
                                <p className="text-sm text-gray-500 mt-1">Click to select multiple languages.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">LinkedIn Cookie</label>
                                <input
                                    type="text"
                                    name="linkedinCookie"
                                    value={formData.linkedinCookie}
                                    readOnly
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.linkedinCookie ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your LinkedIn cookie"
                                />
                                {errors.linkedinCookie && (
                                    <p className="text-red-500 text-sm mt-1">{errors.linkedinCookie}</p>
                                )}
                            </div>
                            {data && data.message && <p className="text-green-500 text-sm">{data.message}</p>}
                            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
                            <button
                                disabled={loading || Object.values(errors).some((error) => error !== '')}
                                type="submit"
                                className={`w-full flex justify-center p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading || Object.values(errors).some((error) => error !== '')
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {loading ? 'Scraping...' : 'Scrap now'}
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
                    </div>
                </div>
            )}
            {results.length > 0 && (
                <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                            LinkedIn Search Results
                        </h1>
                        <button
                            onClick={() => {
                                setResults([]);
                                setPage(1);
                                setErrors({});
                            }}
                            className="inline-flex items-center px-4 py-2 mb-6 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                        >
                            ← Back To Influencer Finder
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((profile: any, index) => (
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



                                            <p className="text-sm text-gray-400 mt-1">
                                                Connections {profile.connectionsCount}
                                            </p>



                                            <p className="text-sm text-gray-400 mt-1">
                                                Followers {profile.followersCount}
                                            </p>


                                            {/* Influence Score */}

                                            <p className="text-sm text-blue-500 mt-1 font-semibold">
                                                Influence Score:{" "}
                                                {Math.round((
                                                    (profile.followersCount || 0) * 0.6 +
                                                    (profile.connectionsCount || 0) * 0.4
                                                ))}
                                            </p>



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
                        {page < maxPages && results.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    // disabled={loading}
                                    // disabled
                                    className={`inline-flex items-center px-6 py-3 rounded-lg text-white text-sm font-medium ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        } transition-colors duration-200`}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                    {loading ? 'Loading...' : <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a4 4 0 00-4 4v3H5a2 2 0 00-2 2v5a2 2 0 
         002 2h10a2 2 0 002-2v-5a2 2 0 
         00-2-2h-1V6a4 4 0 00-4-4zm-2 7V6a2 2 0 
         114 0v3H8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>}
                                    {loading && (
                                        <svg
                                            className="animate-spin h-5 w-5 ml-3 text-white"
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default InfluencerFinders;