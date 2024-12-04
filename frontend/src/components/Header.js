import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import Tooltip from "@mui/material/Tooltip";
import { RiFileList2Fill } from "react-icons/ri";
import { BiUser } from "react-icons/bi";
import { GiKnifeFork } from "react-icons/gi";
import "../assets/css/mainStyle.css";
import "../assets/css/customStyle.css";
import "../assets/css/headerStyle.css";

import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";

import { getToken } from "services/localStorageService";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Thêm state để kiểm tra vai trò người dùng
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
        const roles = data.result.roles;
        const adminRole = roles.find(
          (role) => role.name === "ADMIN" || role.name === "STAFF"
        );
        if (adminRole) {

          setIsAdmin(true);
          localStorage.setItem("isAdmin", true); // Lưu trạng thái vào localStorage
          localStorage.setItem("roles", JSON.stringify(adminRole));
          navigate("/admin");
        } else {
          setIsAdmin(false);
          localStorage.setItem("isAdmin", false); // Nếu không phải Admin
        }

      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const userId = localStorage.getItem("userId");
    const accessToken = getToken(); // Lấy token từ localStorage

    if (accessToken) {
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
                <button
                  onClick={() => navigate("/admin")}
                  className="navbar-link"
                >
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

          <Tooltip title="Thực đơn">
            <a href="/menu" className="navbar-link header-icon">
              <GiKnifeFork />
            </a>
          </Tooltip>

          {isLoggedIn && (
            <Tooltip title="Danh sách hợp đồng">
              <a href="/user/contract-list" className="navbar-link header-icon">
                <RiFileList2Fill />
              </a>
            </Tooltip>
          )}

          <Tooltip>
            {isLoggedIn && (
              <div className="navbar-link header-icon account-dropdown">
                <BiUser />
                <div className="dropdown-menu">
                  <a
                    href="/account"
                    className="dropdown-item navbar-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaUserCircle />
                    Thông tin cá nhân
                  </a>
                  <a
                    href="/#"
                    className="dropdown-item navbar-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AiFillLock />
                    Đổi mật khẩu
                  </a>
                  <a
                    className="dropdown-item navbar-link"
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("userId");
                      navigate("/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiLogOut />
                    Đăng xuất
                  </a>
                </div>
              </div>
            )}
          </Tooltip>

          {/* Hiển thị tên người dùng khi đã đăng nhập */}
          {isLoggedIn && userDetails && (
            <div className="user-name">
              <p className="navbar-link">Chào, {userDetails.fullname}</p>{" "}
              {/* Hiển thị tên người dùng */}
            </div>
          )}

          {/* Ẩn nút "Sign In" nếu đã đăng nhập */}
          {!isLoggedIn && (
            <a href="/login" className="btn btn-hover align-middle">
              Đăng nhập
            </a>
          )}

          <button
            className="nav-toggle-btn"
            aria-label="Toggle Menu"
            data-menu-toggle-btn
          >
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
