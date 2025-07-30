import { useState, useCallback } from 'react';
import apiService from './apiService';
type ValidationError = {
  field: string;
  messages: string[];
};

type LoginUser = {
  id: number;
  name: string;
  email: string;
};

type LoginData = {
  user: LoginUser;
  token: string;
};

type LoginResponse =
  | {
      status: true;
      message: string;
      data: LoginData;
    }
  | {
      status: false;
      message: string;
      errors: ValidationError[];
    };
type HttpMethod = 'get' | 'post';

const methodMap = {
  get: (endpoint: string, headers?: any) => apiService.get(endpoint, headers),
  post: (endpoint: string, data: any, headers?: any) => apiService.post(endpoint, data, headers),
};

const useApi = () => {
const [data, setData] = useState<LoginResponse | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);




  // new code call api
const callApi = useCallback(
  async <T = any>(
    method: HttpMethod,
    endpoint: string,
    payload: any = {},
    headers: any = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let response;

      if (method === 'get') {
        response = await methodMap.get(endpoint, headers);
      } else {
        response = await methodMap.post(endpoint, payload, headers);
      }

      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  },
  []
);

  // new code call api

  return { data, loading, error, callApi };
};

export default useApi;