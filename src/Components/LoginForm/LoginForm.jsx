import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '/src/LearnLeaf_Functions.js';
import { useUser } from '../../UserState';
import { Link } from 'react-router-dom';
import '/src/Components/FormUI.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useUser(); // Assuming useUser is a hook to access UserContext

  const navigate = useNavigate(); // Instantiate navigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { userID, userName } = await loginUser(email, password);
      updateUser({ id: userID, name: userName });
      // Navigate to another route upon successful login, if necessary
      navigate('/tasks'); // Redirect user to the tasks page or another appropriate route
    } catch (error) {
      alert(`Error code: ${error.code}\n${error.message}`);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-form-container"> {/* Changed class name to reflect login form */}
      <h1>LearnLeaf Organizer</h1> {/* Changed heading to Login */}
      <h2>Helping you manage your everyday needs!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button> {/* Changed button text to Login */}
        <i><p><Link to="/resetPassword">Reset Password</Link></p></i>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default LoginForm;
