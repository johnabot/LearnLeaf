import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '/src/LearnLeaf_Functions.jsx';
function ResetPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleSubmit = event => {
    event.preventDefault();
    resetPassword(email).then(() => {
      navigate('/');
    }).catch(error => {
      console.error('Error resetting password:', error);
    });
    setEmail('');
  };
  return <div className="resetPassword-form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Reset</button>
      </form>
    </div>;
}
export default ResetPassword;