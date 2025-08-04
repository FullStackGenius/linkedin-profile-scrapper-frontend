import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import store from './reduxStore/store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
const GOOGLE_LOGIN_KEY = import.meta.env.VITE_GOOGLE_LOGIN_KEY;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_LOGIN_KEY}>
      <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
