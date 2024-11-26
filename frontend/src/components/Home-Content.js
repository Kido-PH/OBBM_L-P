import React, { useState, useEffect } from "react";
import "../assets/css/mainStyle.css";
import "../assets/css/customStyle.css";
import heroBannerBg from "../assets/images/hero-banner-bg.png";
import steak from "../assets/images/steak.png";
import aboutBanner from "../assets/images/about-banner.jpg";
import flowerImage from "../assets/images/flower-1.jpg";
import avatar1 from "../assets/images/avatar-1.jpg";
import avatar2 from "../assets/images/avatar-2.jpg";
import avatar3 from "../assets/images/avatar-3.jpg";
import weddingStage from "../assets/images/wedding-stage.jpg";
import flowerCrown from "../assets/images/flower-crown.jpg";
import event2 from "../assets/images/event-2.jpg";
import turkey from "../assets/images/turkey.jpeg";
import blog1 from "../assets/images/blog-1.jpg";
import blog2 from "../assets/images/blog-2.jpg";
import blog3 from "../assets/images/blog-3.jpg";
import ctabanner from "../assets/images/hero-banner-bg.png";
import danhMucApi from "../api/danhMucApi";
import eventApi from "../api/eventApi.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const blogPosts = [
  {
    imgSrc: blog1,
    alt: "What Do You Think About Cheese Pizza Recipes?",
    badge: "Wedding",
    date: "2022-01-01",
    dateText: "Jan 01 2022",
    author: "Jonathan Smith",
    title: "The Theatre Bar at the End of the Wharf in Dawes Point",
    text: "Financial experts support or help you to to find out which way you can raise your funds more...",
    link: "#",
  },
  {
    imgSrc: blog2,
    alt: "Making Chicken Strips With New Delicious Ingredients.",
    badge: "Wedding",
    date: "2022-01-01",
    dateText: "Jan 01 2022",
    author: "Jonathan Smith",
    title: "Establishment Bar by Merivale in Sydney CBD",
    text: "Attached to the main bar is the garden — an industrial-style terrace area where drinking, dancing, and generally having a great time are encouraged. For an indulgent yet refined Sydney restaurant wedding, Establishment Bar should top your list.",
    link: "#",
  },
  {
    imgSrc: blog3,
    alt: "Innovative Hot Chessyraw Pasta Make Creator Fact.",
    badge: "Wedding",
    date: "2022-01-01",
    dateText: "Jan 01 2022",
    author: "Jonathan Smith",
    title: "Cruise Bar Sydney in The Rocks.",
    text: "Financial experts support or help you to to find out which way you can raise your funds more...",
    link: "#",
  },
];

const testimonials = [
  {
    name: "Robert William",
    title: "CEO Kingfisher",
    avatar: avatar1,
    text: "I would be lost without restaurant. I would like to personally thank you for your outstanding product.",
  },
  {
    name: "Thomas Josef",
    title: "CEO Getforce",
    avatar: avatar2,
    text: "I would be lost without restaurant. I would like to personally thank you for your outstanding product.",
  },
  {
    name: "Charles Richard",
    title: "CEO Angela",
    avatar: avatar3,
    text: "I would be lost without restaurant. I would like to personally thank you for your outstanding product.",
  },
];

const banners = [
  {
    imgSrc: weddingStage,
    alt: "Discount For Delicious Tasty Burgers!",
    subtitle: "20% Off Now!",
    title: "Elegant White Wedding Stage",
    text: "Sale off 20% only this week",
    buttonText: "Book now",
    size: "banner-lg",
  },
  {
    imgSrc: flowerCrown,
    alt: "Delicious Pizza",
    title: "Flower Crown",
    text: "Summer Love Package: Included with Your Wedding Reservation this Season.",
    buttonText: "Order Now",
    size: "banner-sm",
  },
  {
    imgSrc: event2,
    alt: "American Burgers",
    title: "Dosa Chicken Crepe",
    text: "30% off Now",
    buttonText: "Order Now",
    size: "banner-sm",
  },
  {
    imgSrc: turkey,
    alt: "Tasty Buzzed Pizza",
    title: "Thanksgiving Turkey",
    text: "Sale off 20% in this thanksgiving",
    buttonText: "Order Now",
    size: "banner-md",
  },
];

const promoData = [
  {
    title: "Tiệc BBQ Ngoài Trời",
    text: "Thưởng thức các món nướng ngon cùng bạn bè với không gian ngoài trời thoáng đãng.",
    imgSrc: weddingStage, // Thay bằng đường dẫn ảnh phù hợp
    alt: "Tiệc BBQ Ngoài Trời",
  },
  {
    title: "Dạ Tiệc Hoàng Gia",
    text: "Hòa mình vào không gian sang trọng với âm nhạc cổ điển và thực đơn đẳng cấp hoàng gia.",
    imgSrc: weddingStage, // Thay bằng đường dẫn ảnh phù hợp
    alt: "Dạ Tiệc Hoàng Gia",
  },
  {
    title: "Tiệc Buffet Hải Sản",
    text: "Thỏa thích lựa chọn và thưởng thức các món hải sản tươi ngon từ khắp mọi nơi.",
    imgSrc: weddingStage, // Thay bằng đường dẫn ảnh phù hợp
    alt: "Tiệc Buffet Hải Sản",
  },
  {
    title: "Tiệc Cưới Ngoài Trời",
    text: "Chung vui cùng đôi uyên ương trong khung cảnh lãng mạn dưới ánh đèn lung linh.",
    imgSrc: weddingStage, // Thay bằng đường dẫn ảnh phù hợp
    alt: "Tiệc Cưới Ngoài Trời",
  },
  {
    title: "Tiệc Tân Niên",
    text: "Chào đón năm mới với bữa tiệc hoành tráng và những màn pháo hoa rực rỡ.",
    imgSrc: weddingStage, // Thay bằng đường dẫn ảnh phù hợp
    alt: "Tiệc Tân Niên",
  },
];

const Content = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(2); // Gán mặc định là 2
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [Events, setEvents] = useState([]);
  const [EventToMenuUrl, setEventToMenuUrl] = React.useState("");

  
  React.useEffect(() => {
    if (EventToMenuUrl) {
      navigate(EventToMenuUrl);
    }
  }, [EventToMenuUrl, navigate]);

  const fetchDanhMuc = async () => {
    const danhMucList = await danhMucApi.getAll();
    setCategories(danhMucList.result.content);
  };

  const fetchEvent = async () => {
    const EventsList = await eventApi.getAll();
    setEvents(EventsList.result.content); // Cập nhật state
  };
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxOTczMjQzNjUwNiwiaWF0IjoxNzMyNDM2NTA2LCJqdGkiOiIzOGFkMWNhZC0yYjFkLTQxOGUtYmI5Yi0wMDM1ZmM2NTgxYmUiLCJzY29wZSI6IlJPTEVfQURNSU4gREVMRVRFX0RJU0ggQ1JFQVRFX1VTRVIgVVBEQVRFX1NFUlZJQ0VTIERFTEVURV9FVkVOVCBERUxFVEVfTE9DQVRJT04gUkVBRF9TRVJWSUNFUyBSRUFEX0VWRU5UIENSRUFURV9DT05UUkFDVCBSRUFEX0xPQ0FUSU9OIFJFQURfSU5HUkVESUVOVCBERUxFVEVfVVNFUiBDUkVBVEVfTUVOVSBERUxFVEVfU0VSVklDRVMgQ1JFQVRFX0xPQ0FUSU9OIENSRUFURV9FVkVOVCBSRUFEX0NPTlRSQUNUIFVQREFURV9NRU5VIFJFQURfRElTSCBDUkVBVEVfU0VSVklDRVMgREVMRVRFX01FTlUgVVBEQVRFX0VWRU5UIENSRUFURV9ESVNIIFJFQURfVVNFUiBVUERBVEVfTE9DQVRJT04gVVBEQVRFX0NPTlRSQUNUIFVQREFURV9JTkdSRURJRU5UIENSRUFURV9JTkdSRURJRU5UIERFTEVURV9JTkdSRURJRU5UIERFTEVURV9DT05UUkFDVCBSRUFEX01FTlUgVVBEQVRFX0RJU0ggVVBEQVRFX1VTRVIifQ.kaLopBa7E2vF75Eo_9wEKr82jCRfkkOB84-5FvrK5Cmtd2HMTm8nCtkkF-TkcqdOmdVbruCxApS-iB8EtZzO5Q";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage

    fetchDanhMuc(); // Giả sử fetchDanhMuc là hàm async

    fetchEvent();


  }, [activeCategoryId]);

  const handleFilter = (categoryId) => {
    const filtered = categories.filter(
      (category) => category.categoryId === categoryId
    );
    setFilteredCategories(filtered);
    setActiveCategoryId(categoryId);
  };

  const setMenuIdUrl = (eventId) => {
    setEventToMenuUrl(`menu/${eventId}`);
  };

  const pushEventIdtoMenu = async (eventId) => {
    try {
      const Id = eventId;
      setMenuIdUrl(Id);
    } catch (error) {
      console.error("Lỗi khi lấy event Id:", error);
    }
  };
  return (
    <div>
      <main>
        <article>
          <section className="hero" id="home">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">Chuyên nghiệp</p>

                <h2 className="h1 hero-title">Dịch vụ đặt tiệc tốt nhất</h2>

                <p className="hero-text">
                  Sự tận tâm và chu đáo mang đến sự hài lòng cho bạn
                </p>

                <button className="btn">Đặt tiệc ngay</button>
              </div>

              <figure className="hero-banner">
                <img
                  src={heroBannerBg}
                  width="820"
                  height="716"
                  alt=""
                  aria-hidden="true"
                  className="w-100 hero-img-bg"
                />

                <img
                  src={steak}
                  width="700"
                  height="637"
                  loading="lazy"
                  alt="Bít tết"
                  className="w-100 hero-img"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider white promo" id="events">
            <div className="container">
              <h2 className="h2 section-title" style={{textAlign:"center", marginBottom:"20px"}}>Sự kiện</h2>
              <ul className="promo-list has-scrollbar">
                {Events.map((event) => (
                  <li
                    key={event.eventId}
                    className="promo-item"
                    style={{ width: "285px", height: "443px", marginRight:"30px" }}
                  >
                    <button
                      onClick={() => {
                        pushEventIdtoMenu(event.eventId);
                      }}
                    >
                      <div
                        className="promo-card"
                        style={{ width: "285px", height: "443px" }}
                      >
                        <div className="card-icon">
                          {/* Add any specific icons or elements here if needed */}
                        </div>

                        <h3 className="h3 card-title">{event.name}</h3>

                        <p
                          className="card-text"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }}
                        >
                          {event.description}
                        </p>

                        <img
                          src={event.image}
                          width="300"
                          height="300"
                          loading="lazy"
                          alt={event.name}
                          className="w-100 card-banner"
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section section-divider gray about" id="about">
            <div className="container">
              <div className="about-banner">
                <img
                  src={aboutBanner}
                  width="509"
                  height="459"
                  loading="lazy"
                  alt="Burger và Đồ uống"
                  className="w-100 about-img"
                />
              </div>

              <div className="about-content">
                <h2 className="h2 section-title">
                  <span className="span">OBBM:</span> Giải Pháp Đặt Tiệc Trực
                  Tuyến Của Bạn
                </h2>

                <p className="section-text">
                  Tại OBBM, chúng tôi mang đến cho bạn dịch vụ đặt tiệc trực
                  tuyến tiện lợi và hiệu quả với chất lượng không thể bàn cãi.
                  Đội ngũ của chúng tôi bao gồm những chuyên gia tận tâm, luôn
                  sẵn sàng phục vụ bạn với lòng nhiệt thành cao nhất. Với các
                  đầu bếp tay nghề cao từ khắp nơi trên thế giới, chúng tôi hứa
                  hẹn mang đến cho bạn những hương vị tinh tế tại sự kiện của
                  mình. Được trang bị cơ sở vật chất hiện đại và đáp ứng các chủ
                  đề đa dạng, chúng tôi đảm bảo vượt xa mong đợi của bạn mỗi
                  lần.
                </p>

                <ul className="about-list">
                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">
                      Món ăn ngon và tốt cho sức khỏe
                    </span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">
                      Đội ngũ chuyên nghiệp và tận tâm
                    </span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">Âm nhạc và các tiện nghi khác</span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">Hỗ trợ và tư vấn nhiệt tình</span>
                  </li>
                </ul>

                <button className="btn btn-hover">Đặt Tiệc Ngay</button>
              </div>
            </div>
          </section>

          <section className="section food-menu" id="food-menu">
            <div className="container">
              <p className="section-subtitle">Món ăn phổ biến</p>

              <h2 className="h2 section-title">
                Những món ngon <span className="span"> của chúng tôi</span>
              </h2>

              <ul className="fiter-list">
                <li>
                  <button
                    className={`filter-btn ${
                      activeCategoryId === 1 ? "active" : ""
                    }`}
                    onClick={() => handleFilter(1)}
                  >
                    Khai vị
                  </button>
                </li>

                <li>
                  <button
                    className={`filter-btn ${
                      activeCategoryId === 2 ? "active" : ""
                    }`}
                    onClick={() => handleFilter(2)}
                  >
                    Món chính
                  </button>
                </li>

                <li>
                  <button
                    className={`filter-btn ${
                      activeCategoryId === 3 ? "active" : ""
                    }`}
                    onClick={() => handleFilter(3)}
                  >
                    Tráng miệng
                  </button>
                </li>

                <li>
                  <button
                    className={`filter-btn ${
                      activeCategoryId === 4 ? "active" : ""
                    }`}
                    onClick={() => handleFilter(4)}
                  >
                    Đồ uống
                  </button>
                </li>
              </ul>

              {filteredCategories.map((category) => (
                <div key={category.categoryId} style={{display: "flex",
                  justifyContent: "center",
                  alignItems: "center"}}>
                  <ul className="food-menu-list">
                    {category.listDish.map((dish) => (
                      <li key={dish.dishId}>
                        <div className="food-menu-card">
                          <div className="card-banner-home-dish">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              style={{ width: "100%", height: "120px" }}
                              loading="lazy"
                              className="w-100"
                            />

                            <button className="btn food-menu-btn">
                              <a href="/menu">Thêm vào Thực đơn</a>
                            </button>
                          </div>

                          <div className="wrapper">
                            <p className="category">{category.description}</p>
                          </div>

                          <h4
                            className=" card-title"
                            style={{ textAlign: "center" }}
                          >
                            {dish.name}
                          </h4>

                          {/* <div className="price-wrapper">
                            <p className="price-text">Giá:</p>
                            {dish.price.toLocaleString()} VND
                          </div> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="section section-divider white cta ">
            <div className="container">
              <div className="cta-content">
                <h2 className="h2 section-title">
                  Thức uống pha chế tinh tế: Cảm nhận sự{" "}
                  <span className="span">Khác biệt</span>
                </h2>

                <p className="section-text">
                  Tại OBBM, các bartender chuyên nghiệp của chúng tôi khéo léo
                  pha chế các loại thức uống đặc biệt để nâng tầm trải nghiệm sự
                  kiện của bạn. Từ các loại cocktail cổ điển đến những sáng tạo
                  độc đáo, chúng tôi đảm bảo mỗi ngụm đều để lại ấn tượng khó
                  quên.
                </p>

                <button className="btn btn-hover">Đặt ngay</button>
              </div>
              <figure className="cta-banner">
                <img
                  src={ctabanner}
                  width="700"
                  height="637"
                  loading="lazy"
                  alt="Bánh mì kẹp thịt"
                  className="w-100 cta-img"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider gray delivery">
            <div className="container">
              <div className="delivery-content">
                <h2 className="h2 section-title">
                  Khoảnh Khắc Được Giao Đúng{" "}
                  <span className="span">Thời Gian</span> & Địa Điểm
                </h2>

                <p className="section-text">
                  Các nhà hàng ở Hàng Châu cũng phục vụ cho nhiều người Trung
                  Quốc miền Bắc đã di cư xuống phía Nam từ Khai Phong trong cuộc
                  xâm lược của người Nữ Chân vào những năm 1120, và cũng có rất
                  nhiều nhà hàng được điều hành bởi các gia đình.
                </p>

                <button className="btn btn-hover">Đặt Hàng Ngay</button>
              </div>

              <figure className="delivery-banner">
                <img
                  src={flowerImage}
                  width="700"
                  height="602"
                  loading="lazy"
                  alt="đám mây"
                  className="w-100"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider white testi">
            <div className="container">
              <p className="section-subtitle">Nhận Xét</p>

              <h2 className="h2 section-title">
                Đánh Giá Từ <span className="span">Khách Hàng</span> Của Chúng
                Tôi
              </h2>

              <p className="section-text">
                Thực phẩm là bất kỳ chất nào được tiêu thụ để cung cấp dinh
                dưỡng cho cơ thể.
              </p>

              <ul className="testi-list has-scrollbar">
                {testimonials.map((testimonial, index) => (
                  <li className="testi-item" key={index}>
                    <div className="testi-card">
                      <div className="profile-wrapper">
                        <figure className="avatar">
                          <img
                            src={testimonial.avatar}
                            width="80"
                            height="80"
                            loading="lazy"
                            alt={testimonial.name}
                          />
                        </figure>

                        <div>
                          <h3 className="h4 testi-name">{testimonial.name}</h3>
                          <p className="testi-title">{testimonial.title}</p>
                        </div>
                      </div>

                      <blockquote className="testi-text">
                        "{testimonial.text}"
                      </blockquote>

                      <div className="rating-wrapper">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section section-divider gray banner">
            <div className="container">
              <ul className="banner-list">
                {banners.map((banner, index) => (
                  <li className={`banner-item ${banner.size}`} key={index}>
                    <div className="banner-card">
                      <img
                        src={banner.imgSrc}
                        width="550"
                        height={banner.size === "banner-lg" ? "450" : "465"}
                        loading="lazy"
                        alt={banner.alt}
                        className="banner-img"
                      />

                      <div className="banner-item-content">
                        {banner.subtitle && (
                          <p className="banner-subtitle">{banner.subtitle}</p>
                        )}
                        <h3 className="banner-title">{banner.title}</h3>
                        <p className="banner-text">{banner.text}</p>
                        <button className="btn">{banner.buttonText}</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section section-divider white blog" id="blog">
            <div className="container">
              <p className="section-subtitle">Bài Viết Mới Nhất</p>

              <h2 className="h2 section-title">
                Sự Kiện <span className="span">Kỷ Niệm Đặc Biệt</span> Của Chúng
                Tôi
              </h2>

              <p className="section-text">Nơi Mỗi Dịp Đều Tỏa Sáng!</p>

              <ul className="blog-list">
                {blogPosts.map((post, index) => (
                  <li key={index}>
                    <div className="blog-card">
                      <div className="card-banner">
                        <img
                          src={post.imgSrc}
                          width="600"
                          height="390"
                          loading="lazy"
                          alt={post.alt}
                          className="w-100"
                        />
                        <div className="badge">{post.badge}</div>
                      </div>

                      <div className="card-content">
                        <div className="card-meta-wrapper">
                          <a href={post.link} className="card-meta-link">
                            <ion-icon name="calendar-outline"></ion-icon>
                            <time className="meta-info" dateTime={post.date}>
                              {post.dateText}
                            </time>
                          </a>
                          <a href={post.link} className="card-meta-link">
                            <ion-icon name="person-outline"></ion-icon>
                            <p className="meta-info">{post.author}</p>
                          </a>
                        </div>

                        <h3 className="h3">
                          <a href={post.link} className="card-title">
                            {post.title}
                          </a>
                        </h3>

                        <p className="card-text">{post.text}</p>

                        <a href={post.link} className="btn-link">
                          <span>Đọc Thêm</span>
                          <ion-icon
                            name="arrow-forward"
                            aria-hidden="true"
                          ></ion-icon>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};

export default Content;
