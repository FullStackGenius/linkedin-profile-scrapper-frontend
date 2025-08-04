import React, { useState} from 'react';
import type { FormEvent } from 'react';
import Layout from './Layout';


interface FormData {
  keyword: string;
  industry: string[];
  language: string[];
}

const B2BInfluencerFinder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    keyword: '',
    industry: [],
    language: [],
  });

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

  const handleSearch = (e: FormEvent) => {
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
    window.open(dynamicUrl, '_blank', 'noopener,noreferrer');
    //window.location.href = dynamicUrl; // Redirect to the constructed URL
  };

  return (
     <Layout>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">B2B Influencer Finder</h2>
        <p className="text-gray-600 text-center mb-6">Find relevant LinkedIn profiles based on search criteria.</p>
        <form onSubmit={handleSearch} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </form>
      </div>
    </div>
     </Layout>
  );
};

export default B2BInfluencerFinder;