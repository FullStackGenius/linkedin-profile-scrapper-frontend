import { useState, useCallback } from 'react';
import apiService from './apiService';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (method, endpoint, payload = {}, headers = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiService[method](endpoint, payload, headers);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, callApi };
};

export default useApi;