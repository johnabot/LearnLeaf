import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import { UserProvider } from './UserState.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(<UserProvider>
        <App />
    </UserProvider>);