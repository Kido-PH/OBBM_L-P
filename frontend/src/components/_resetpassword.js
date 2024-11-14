import React from 'react';

const ResetPasswordForm = ({ toggleForm }) => {

  const goToForgotPasswordStep2 = () => {
    document.getElementById('forgotPasswordStep1').style.display = 'none';
    document.getElementById('forgotPasswordStep2').style.display = 'block';
  };

  return (
    <div className="login-form" id="forgotPasswordForm">
      <h1>Reset Password</h1>
      <form id="forgotPasswordStep1" method="post">
        <input type="text" placeholder="Username" name="username" required style={{ height: '41.2px' }}/>
        {/* <input type="email" placeholder="Email" name="email" required style={{ height: '41.2px' }}/> */}
        <input type="button" value="Receive Code" onClick={goToForgotPasswordStep2} />
      </form>
      <form id="forgotPasswordStep2" method="post" style={{ display: 'none' }}>
        <input type="text" placeholder="Verification Code" name="code" required maxLength="6" pattern="[0-9]{6}" title="Please enter a 6-digit code" style={{ height: '41.2px' }}/>
        <input type="password" placeholder="New Password" name="new-password" required style={{ height: '41.2px' }}/>
        <input type="password" placeholder="Confirm New Password" name="confirm-password" required style={{ height: '41.2px' }}/>
        <input type="submit" value="Reset Password" />
      </form>
      <div className="register-link" onClick={() => toggleForm('login')}>
        Return to Login
      </div>
    </div>
  );
};

export default ResetPasswordForm;
