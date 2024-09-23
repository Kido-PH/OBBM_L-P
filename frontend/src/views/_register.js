import React from 'react';

const RegisterForm = ({ toggleForm }) => {

  const goToRegisterStep2 = () => {
    document.getElementById('registerStep1').style.display = 'none';
    document.getElementById('registerStep2').style.display = 'block';
  };

  return (
    <div className="login-form" id="registerForm">
      <h1>Register</h1>
      <form id="registerForm" method="post">
        <div id="registerStep1">
          <input type="text" placeholder="Username" name="username" required />
          <input type="email" placeholder="Email" name="email" required />
          <input type="button" value="Receive Code" onClick={goToRegisterStep2} />
        </div>
        <div id="registerStep2" style={{ display: 'none' }}>
          <input type="text" placeholder="Verification Code" name="email-code" required maxLength="6" pattern="[0-9]{6}" title="Please enter a 6-digit code" />
          <input type="password" placeholder="Password" name="password" required />
          <input type="password" placeholder="Confirm Password" name="confirm-password" required />
          <input type="submit" value="Register" />
        </div>
      </form>
      {/* <div className="social-login">
        <a href="#" className="google-login">Sign up with Google</a>
        <a href="#" className="facebook-login">Sign up with Facebook</a>
      </div> */}
      <div className="register-link" onClick={() => toggleForm('login')}>
        Return to Login
      </div>
    </div>
  );
};

export default RegisterForm;
