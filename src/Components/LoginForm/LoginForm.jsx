import React from 'react'
import './LoginForm.css';

class LoginForm extends React.Component {
    render() {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <h1>LearnLeaf Task Organizer</h1>
          <p>Helping you manage your everyday needs!</p>
          <form style={{ display: 'flex', flexDirection: 'column', width: '300px', alignItems: 'center' }}>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
            <button type="submit">Login</button>
            <p>Don't have an account? <a href="/register">Register</a></p>
          </form>
        </div>
      );
    }
  }
  
  export default LoginForm;