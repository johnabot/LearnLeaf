import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm.jsx';
import RegistrationForm from './Components/RegisterUser/RegisterForm.jsx';
import ResetPassword from './Components/ResetPassword/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

