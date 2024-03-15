import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import { UserProvider } from '/src/UserState.jsx'; // Adjust the path based on your file structure

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* Wrap App component with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
);
