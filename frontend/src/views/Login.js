import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import thêm useNavigate và useLocation
import '../assets/css/style.css';
import LoginForm from './_login';
import RegisterForm from './_register';
import ResetPasswordForm from './_resetpassword';

const Login = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const location = useLocation(); // Sử dụng useLocation để lấy URL hiện tại
  const [currentForm, setCurrentForm] = useState('login');

  // Kiểm tra URL hiện tại để xác định form đang hiển thị
  useEffect(() => {
    if (location.pathname === '/register') {
      setCurrentForm('register');
    } else if (location.pathname === '/resetpassword') {
      setCurrentForm('forgotPassword');
    } else {
      setCurrentForm('login');
    }
  }, [location.pathname]);

  // Điều chỉnh event click cho hình ảnh
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

  // Hàm chuyển form và cập nhật URL
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

    // Cập nhật form hiện tại
    setCurrentForm(targetForm);

    // Điều hướng URL dựa trên form
    if (targetForm === 'login') {
      navigate('/login');
    } else if (targetForm === 'register') {
      navigate('/register');
    } else if (targetForm === 'forgotPassword') {
      navigate('/resetpassword');
    }
  };

  return (
    <div className='body-login'>
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
    </div>
  );
};

export default Login;
