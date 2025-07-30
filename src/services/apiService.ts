import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiService = {
  // Initialize Axios instance
  instance: axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  // Set JWT token in headers
  setAuthToken(token:string) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token); // Store token in localStorage
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  },

  // Initialize token from localStorage on app load
  init() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthToken(token);
    }
  },

  // POST request (e.g., for login)
  async post(endpoint:string, data:any, customHeaders = {}) {
    try {
      const response = await this.instance.post(endpoint, data, {
        headers: customHeaders,
      });
      return response.data;
    } catch (error:any) {
      console.log(error);
      const status = error.response?.status;
    const responseMessage = error.response?.data?.message || error.response?.data?.error;
    // const validationErrors = [];
    let message = responseMessage || 'An error occurred. Please try again.';

    if (status) {
      switch (status) {
        case 400:
          message = responseMessage || 'Bad Request. Please check your input.';
          break;
        case 401:
          message = responseMessage || 'Unauthorized access. Please log in again.';
          break;
        case 403:
          message = responseMessage || 'Forbidden. You do not have permission.';
          break;
          case 422:
          message = responseMessage || 'Validation failed.';
         // validationErrors = error.response?.data?.errors?.flatMap(err => err.messages) || [];
          break;
        case 404:
          message = responseMessage || 'Resource not found.';
          break;
        case 500:
          message = responseMessage || 'Internal server error.';
          break;
        default:
          message = responseMessage || `Unexpected error (status code: ${status}).`;
      }
    }

    console.error(`POST ${endpoint} failed [${status}]:`, message);
    throw new Error(message);
      // throw new Error(
      //   error.response?.data?.error || error.message || 'An error occurred. Please try again.'
      // );
    }
  },

  // GET request (example for authenticated requests)
  async get(endpoint:string, customHeaders = {}) {
    try {
      const response = await this.instance.get(endpoint, {
        headers: customHeaders,
      });
      return response.data;
    } catch (error:any) {
      throw new Error(
        error.response?.data?.error || error.message || 'An error occurred. Please try again.'
      );
    }
  },
};

export default apiService;