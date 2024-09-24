import React from "react";
import "../assets/css/mainStyle.css";
import "../assets/css/customStyle.css";
import heroBannerBg from "../assets/images/hero-banner-bg.png";
import steak from "../assets/images/steak.png";
import promo1 from "../assets/images/promo-1.png";
import promo2 from "../assets/images/promo-2.png";
import promo3 from "../assets/images/promo-3.png";
import promo4 from "../assets/images/promo-4.png";
import promo5 from "../assets/images/promo-5.png";
import aboutBanner from "../assets/images/about-banner.jpg";
import foodMenu1 from "../assets/images/food-menu-1.png";
import foodMenu2 from "../assets/images/food-menu-2.png";
import foodMenu3 from "../assets/images/food-menu-3.png";
import foodMenu4 from "../assets/images/food-menu-4.png";
import foodMenu5 from "../assets/images/food-menu-5.png";
import foodMenu6 from "../assets/images/food-menu-6.png";
import flowerImage from "../assets/images/flower-1.jpg";
import avatar1 from "../assets/images/avatar-1.jpg";
import avatar2 from "../assets/images/avatar-2.jpg";
import avatar3 from "../assets/images/avatar-3.jpg";
import weddingStage from "../assets/images/wedding-stage.jpg";
import flowerCrown from "../assets/images/flower-crown.jpg";
import event2 from "../assets/images/event-2.jpg";
import turkey from "../assets/images/turkey.jpeg";
import blog1 from '../assets/images/blog-1.jpg';
import blog2 from '../assets/images/blog-2.jpg';
import blog3 from '../assets/images/blog-3.jpg';
import ctabanner from '../assets/images/hero-banner-bg.png';

const blogPosts = [
  {
    imgSrc: blog1,
    alt: 'What Do You Think About Cheese Pizza Recipes?',
    badge: 'Wedding',
    date: '2022-01-01',
    dateText: 'Jan 01 2022',
    author: 'Jonathan Smith',
    title: 'The Theatre Bar at the End of the Wharf in Dawes Point',
    text: 'Financial experts support or help you to to find out which way you can raise your funds more...',
    link: '#'
  },
  {
    imgSrc: blog2,
    alt: 'Making Chicken Strips With New Delicious Ingredients.',
    badge: 'Wedding',
    date: '2022-01-01',
    dateText: 'Jan 01 2022',
    author: 'Jonathan Smith',
    title: 'Establishment Bar by Merivale in Sydney CBD',
    text: 'Attached to the main bar is the garden — an industrial-style terrace area where drinking, dancing, and generally having a great time are encouraged. For an indulgent yet refined Sydney restaurant wedding, Establishment Bar should top your list.',
    link: '#'
  },
  {
    imgSrc: blog3,
    alt: 'Innovative Hot Chessyraw Pasta Make Creator Fact.',
    badge: 'Wedding',
    date: '2022-01-01',
    dateText: 'Jan 01 2022',
    author: 'Jonathan Smith',
    title: 'Cruise Bar Sydney in The Rocks.',
    text: 'Financial experts support or help you to to find out which way you can raise your funds more...',
    link: '#'
  }
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

const foodMenuData = [
  {
    title: "Fried Chicken Unlimited",
    category: "Chicken",
    price: "$49.00",
    oldPrice: "$69.00",
    discount: "-15%",
    imgSrc: foodMenu1,
    alt: "Fried Chicken Unlimited",
  },
  {
    title: "Burger King Whopper",
    category: "Noodles",
    price: "$29.00",
    oldPrice: "$39.00",
    discount: "-10%",
    imgSrc: foodMenu2,
    alt: "Burger King Whopper",
  },
  {
    title: "White Castle Pizzas",
    category: "Pizzas",
    price: "$49.00",
    oldPrice: "$69.00",
    discount: "-25%",
    imgSrc: foodMenu3,
    alt: "White Castle Pizzas",
  },
  {
    title: "Bell Burrito Supreme",
    category: "Burrito",
    price: "$59.00",
    oldPrice: "$69.00",
    discount: "-20%",
    imgSrc: foodMenu4,
    alt: "Bell Burrito Supreme",
  },
  {
    title: "Kung Pao Chicken BBQ",
    category: "Nuggets",
    price: "$49.00",
    oldPrice: "$69.00",
    discount: "-5%",
    imgSrc: foodMenu5,
    alt: "Kung Pao Chicken BBQ",
  },
  {
    title: "Wendy's Chicken",
    category: "Chicken",
    price: "$49.00",
    oldPrice: "$69.00",
    discount: "-15%",
    imgSrc: foodMenu6,
    alt: "Wendy's Chicken",
  },
];

const promoData = [
  {
    title: "Mexican Pizza",
    text: "Food is any substance consumed to provide nutritional support for an organism.",
    imgSrc: promo1,
    alt: "Mexican Pizza",
  },
  {
    title: "Soft Drinks",
    text: "Food is any substance consumed to provide nutritional support for an organism.",
    imgSrc: promo2,
    alt: "Soft Drinks",
  },
  {
    title: "French Fry",
    text: "Food is any substance consumed to provide nutritional support for an organism.",
    imgSrc: promo3,
    alt: "French Fry",
  },
  {
    title: "Burger Kingo",
    text: "Food is any substance consumed to provide nutritional support for an organism.",
    imgSrc: promo4,
    alt: "Burger Kingo",
  },
  {
    title: "Chicken Masala",
    text: "Food is any substance consumed to provide nutritional support for an organism.",
    imgSrc: promo5,
    alt: "Chicken Masala",
  },
];

const Content = () => {
  return (
    <div>
      <main>
        <article>
          <section className="hero" id="home">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">Professional</p>

                <h2 className="h1 hero-title">
                  Best banquet booking service in city!
                </h2>

                <p className="hero-text">
                  Dedication and thoughtfulness bring satisfaction to you
                </p>

                <button className="btn">Book a banquet</button>
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
                  alt="Steak"
                  className="w-100 hero-img"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider white promo">
            <div className="container">
              <ul className="promo-list has-scrollbar">
                {promoData.map((promo, index) => (
                  <li key={index} className="promo-item">
                    <div className="promo-card">
                      <div className="card-icon">
                        {/* Add any specific icons or elements here if needed */}
                      </div>

                      <h3 className="h3 card-title">{promo.title}</h3>

                      <p className="card-text">{promo.text}</p>

                      <img
                        src={promo.imgSrc}
                        width="300"
                        height="300"
                        loading="lazy"
                        alt={promo.alt}
                        className="w-100 card-banner"
                      />
                    </div>
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
                  alt="Burger with Drinks"
                  className="w-100 about-img"
                />
              </div>

              <div className="about-content">
                <h2 className="h2 section-title">
                  <span className="span">OBBM:</span> Your Online Catering
                  Solution
                </h2>

                <p className="section-text">
                  At OBBM, we offer you a seamless and efficient online catering
                  service with uncompromising quality. Our team comprises
                  dedicated professionals who are always ready to serve you with
                  utmost sincerity. With our highly skilled chefs from around
                  the globe, we promise to tantalize your taste buds with
                  exquisite flavors at your event. Equipped with modern
                  facilities and catering to diverse themes, we ensure to exceed
                  your expectations every time.
                </p>

                <ul className="about-list">
                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">Delicious & Healthy Foods</span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">
                      Professional and dedicated team
                    </span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">Music & Other Facilities</span>
                  </li>

                  <li className="about-item">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span className="span">
                      Enthusiastic support and advice
                    </span>
                  </li>
                </ul>

                <button className="btn btn-hover">Booking Now</button>
              </div>
            </div>
          </section>

          <section className="section food-menu" id="food-menu">
            <div className="container">
              <p className="section-subtitle">Popular Dishes</p>

              <h2 className="h2 section-title">
                Our Delicious <span className="span">Foods</span>
              </h2>

              <p className="section-text">
                Food is any substance consumed to provide nutritional support
                for an organism.
              </p>

              <ul className="fiter-list">
                <li>
                  <button className="filter-btn active">All</button>
                </li>

                <li>
                  <button className="filter-btn">Appetizer</button>
                </li>

                <li>
                  <button className="filter-btn">Main dishes</button>
                </li>

                <li>
                  <button className="filter-btn">Desserts</button>
                </li>

                <li>
                  <button className="filter-btn">Drinks</button>
                </li>

                <li>
                  <button className="filter-btn">Others</button>
                </li>
              </ul>

              <ul className="food-menu-list">
                {foodMenuData.map((item, index) => (
                  <li key={index}>
                    <div className="food-menu-card">
                      <div className="card-banner">
                        <img
                          src={item.imgSrc}
                          width="300"
                          height="300"
                          loading="lazy"
                          alt={item.alt}
                          className="w-100"
                        />

                        <div className="badge">{item.discount}</div>

                        <button className="btn food-menu-btn">
                          Add To Menu
                        </button>
                      </div>

                      <div className="wrapper">
                        <p className="category">{item.category}</p>

                        <div className="rating-wrapper">
                          {/* Assuming you want a fixed number of stars, replace with actual logic if needed */}
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                        </div>
                      </div>

                      <h3 className="h3 card-title">{item.title}</h3>

                      <div className="price-wrapper">
                        <p className="price-text">Price:</p>

                        <data className="price" value={item.price}>
                          {item.price}
                        </data>

                        <del className="del" value={item.oldPrice}>
                          {item.oldPrice}
                        </del>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="section section-divider white cta "
            >
            <div className="container">
              <div className="cta-content">
                <h2 className="h2 section-title">
                  Crafted Cocktails: Taste the{" "}
                  <span className="span">Difference</span>
                </h2>

                <p className="section-text">
                  At OBBM, our professional bartenders expertly craft bespoke
                  drinks to elevate your event experience. From classic
                  cocktails to innovative concoctions, we ensure every sip is
                  unforgettable
                </p>

                <button className="btn btn-hover">Order Now</button>
              </div>
              <figure className="cta-banner">
                <img
                  src={ctabanner}
                  width="700"
                  height="637"
                  loading="lazy"
                  alt="Burger"
                  className="w-100 cta-img"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider gray delivery">
            <div className="container">
              <div className="delivery-content">
                <h2 className="h2 section-title">
                  A Moments Of Delivered On{" "}
                  <span className="span">Right Time</span> & Place
                </h2>

                <p className="section-text">
                  The restaurants in Hangzhou also catered to many northern
                  Chinese who had fled south from Kaifeng during the Jurchen
                  invasion of the 1120s, while it is also known that many
                  restaurants were run by families.
                </p>

                <button className="btn btn-hover">Order Now</button>
              </div>

              <figure className="delivery-banner">
                <img
                  src={flowerImage}
                  width="700"
                  height="602"
                  loading="lazy"
                  alt="clouds"
                  className="w-100"
                />
              </figure>
            </div>
          </section>

          <section className="section section-divider white testi">
            <div className="container">
              <p className="section-subtitle">Testimonials</p>

              <h2 className="h2 section-title">
                Our Customers <span className="span">Reviews</span>
              </h2>

              <p className="section-text">
                Food is any substance consumed to provide nutritional support
                for an organism.
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
        <p className="section-subtitle">Latest Blog Posts</p>

        <h2 className="h2 section-title">
          Our Signature <span className="span">Celebratory Events</span>
        </h2>

        <p className="section-text">Where Every Occasion Sparkles!</p>

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
                    <span>Read More</span>
                    <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
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
