// src/components/Header.js
import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { RiContractLine } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { BiUser } from "react-icons/bi";

import "../assets/css/mainStyle.css";
import "../assets/css/customStyle.css";
import "../assets/css/headerStyle.css";

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
            <li>
              <a href="/admin" className="navbar-link" data-nav-link>
                Admin
              </a>
            </li>
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

          <Tooltip title="Contract">
            <a href="/contract" className="navbar-link header-icon">
              <RiContractLine />
            </a>
          </Tooltip>

          <Tooltip title="Account">
            <a href="/account" className="navbar-link header-icon">
              <BiUser />
            </a>
          </Tooltip>

          <a href="/login" className="btn btn-hover align-middle">
            Sign In
          </a>
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
