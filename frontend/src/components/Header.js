import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import Tooltip from "@mui/material/Tooltip";
import { RiContractLine } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { BiUser } from "react-icons/bi";

import "../assets/css/mainStyle.css";
import "../assets/css/customStyle.css";
import "../assets/css/headerStyle.css";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Thêm state để kiểm tra vai trò người dùng
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Hàm lấy thông tin người dùng từ API
  const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(`http://localhost:8080/obbm/users/myInfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log(data); // Kiểm tra dữ liệu trả về

      if (data && data.result) {
        setUserDetails(data.result);
        // Kiểm tra nếu vai trò người dùng là "ADMIN"
        const roles = data.result.roles;
        const adminRole = roles.find(role => role.name === "ADMIN");
        if (adminRole) {
          setIsAdmin(true); // Nếu có vai trò ADMIN, set isAdmin là true
          navigate("/admin"); // Điều hướng đến trang Admin ngay khi đăng nhập nếu là Admin
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    if (userId && accessToken) {
      setIsLoggedIn(true); // Đã đăng nhập
      getUserDetails(accessToken); // Lấy thông tin người dùng
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isActive ? "active" : ""}`} data-header>
      <div className="container">
        <h1>
          <a href="/" className="logo">
            OBBM<span className="span">.</span>
          </a>
        </h1>

        <nav className="navbar" data-navbar>
          <ul className="navbar-list">
            <li className="nav-item">
              <a href="/" className="navbar-link" data-nav-link>
                Trang chủ
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="navbar-link" data-nav-link>
                Về chúng tôi
              </a>
            </li>
            <li className="nav-item">
              <a href="#events" className="navbar-link" data-nav-link>
                Sự kiện
              </a>
            </li>
            <li className="nav-item">
              <a href="#food-menu" className="navbar-link" data-nav-link>
                Món ăn
              </a>
            </li>

            <li className="nav-item">
              <a href="#blog" className="navbar-link" data-nav-link>
                Nhật ký
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="navbar-link" data-nav-link>
                Liên hệ
              </a>
            </li>

            {/* Hiển thị nút "Admin" chỉ khi người dùng có vai trò Admin */}
            {isAdmin && (
              <li>
                <button onClick={() => navigate("/admin")} className="navbar-link">
                  Admin
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-btn-group">
          <button className="search-btn" aria-label="Search" data-search-btn>
            <ion-icon name="search-outline"></ion-icon>
          </button>

          <Tooltip title="Menu">
            <a href="/menu" className="navbar-link header-icon">
              <BiSolidFoodMenu />
            </a>
          </Tooltip>

          <Tooltip title="Account">
            <a href="/account" className="navbar-link header-icon">
              <BiUser />
            </a>
          </Tooltip>

          {/* Ẩn nút "Sign In" nếu đã đăng nhập */}
          {!isLoggedIn && (
            <a href="/login" className="btn btn-hover align-middle">
              Đăng nhập
            </a>
          )}

          <button
            className="nav-toggle-btn"
            aria-label="Toggle Menu"
            data-menu-toggle-btn>
            <span className="line top"></span>{" "}
            <span className="line middle"></span>{" "}
            <span className="line bottom"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
