import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserProvider } from './UserState.jsx';  // User context provider
import './App.css';  // Assuming you have some global styles

function App() {
  return (
    <UserProvider>
      <div className="app-container">
        <main className="main-content">
          <Outlet /> {/* This will render the current route's component */}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
