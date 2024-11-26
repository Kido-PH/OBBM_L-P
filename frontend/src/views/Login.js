import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';
import LoginForm from './_login';
import RegisterForm from './_register';
import ResetPasswordForm from './_resetpassword';

const Login = () => {
  const [currentForm, setCurrentForm] = useState('login');

  useEffect(() => {
    const loginImage = document.querySelector(".login-image");

    const handleClick = () => {
      if (currentForm !== 'login') {
        toggleForm('login');
      }
    };

    if (currentForm !== 'login') {
      loginImage.addEventListener("click", handleClick);
    } else {
      loginImage.removeEventListener("click", handleClick);
    }

    return () => {
      loginImage.removeEventListener("click", handleClick);
    };
  }, [currentForm]);

  const toggleForm = (targetForm) => {
    if (!targetForm) {
      if (currentForm === 'register') {
        targetForm = 'login';
      } else if (currentForm === 'login') {
        targetForm = 'forgotPassword';
      } else {
        targetForm = 'register';
      }
    }

    setCurrentForm(targetForm);
  };

  return (
    <body className='body-login'>
    <div className="login-container">
      <div
        className={`login-image ${currentForm === 'login' ? 'left' : 'right'}`}
        style={{ 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          cursor: currentForm === 'login' ? 'default' : 'pointer'
        }}
      ></div>

      {currentForm === 'login' && (
        <LoginForm toggleForm={toggleForm} />
      )}

      {currentForm === 'register' && (
        <RegisterForm toggleForm={toggleForm} />
      )}

      {currentForm === 'forgotPassword' && (
                <ResetPasswordForm toggleForm={toggleForm} />
      )}
    </div>
    </body>
  );
};

export default Login;
