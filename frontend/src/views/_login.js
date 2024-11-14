import React from 'react';

const LoginForm = ({ toggleForm }) => {
  return (
    <div className="login-form" id="loginForm">
      <h1>Log in</h1>
      <form>
        <input type="text" placeholder="Username" name="username" required style={{ height: '41.2px' }}/>
        <input type="password" placeholder="Password" name="password" required style={{ height: '41.2px' }}/>
        <input type="submit" value="Log in" />
      </form>
      <div className="social-login">
        <a href="#" className="google-login">Sign in with Google</a>
      </div>
      <div className="forgot-password" onClick={() => toggleForm('forgotPassword')}>
        <a href="#">Reset Password</a>
      </div>
      <div className="register-link" onClick={() => toggleForm('register')} style={{color:"#3d4fc8"}}>
        Don't have an account? <strong>Create</strong> one
      </div>
    </div>
  );
};

export default LoginForm;
