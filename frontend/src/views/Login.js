import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';
import LoginForm from './_login';
import RegisterForm from './_register';
import ResetPasswordForm from './_resetpassword';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [currentForm, setCurrentForm] = useState('login');
  const navigate = useNavigate();
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
    if (currentForm === 'login') {
      navigate('/login');
    } else if (currentForm === 'register') {
      navigate('/register');
    } else if (currentForm === 'forgotPassword') {
      navigate('/resetpassword');
    }

    return () => {
      loginImage.removeEventListener("click", handleClick);
    };
  }, [currentForm,navigate]);

  const toggleForm = (targetForm) => {
    setCurrentForm(targetForm);  // Update the form displayed
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
