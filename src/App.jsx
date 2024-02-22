import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '/workspaces/Team6_3311/src/Components/LoginForm/LoginForm.jsx';
import RegistrationForm from '/workspaces/Team6_3311/src/Components/RegisterUser/RegisterForm.jsx'; // Assuming this is your registration form component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {/* <Route path="/login" element={<LoginForm />} /> */}
        <Route path="/register" element={<RegistrationForm />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

