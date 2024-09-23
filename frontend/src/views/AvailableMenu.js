import React, { useState } from 'react';
import Slider from 'react-slick';
import '../assets/css/menu.css'; // Đảm bảo rằng bạn đã thêm CSS cho slick-carousel
import food from '../assets/images/food-menu-2.png';

// Import slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AvailableMenu = ({ onSelectMenu }) => {
  const [selectedMenu, setSelectedMenu] = useState(null); // State để lưu thực đơn được chọn

  // Dữ liệu thực đơn với các món ăn cụ thể
  const menuData = {
    'VietNam menu': [
      {
         
        Appetizer: [
          { name: "Pho", price: "50.000đ", image: food },
          { name: "Banh Mi", price: "20.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Bun Cha", price: "70.000đ", image: food },
          { name: "Com Tam", price: "60.000đ", image: food }
        ],
        Dessert: [
          { name: "Che Ba Ba", price: "30.000đ", image: food },
          { name: "Banh Flan", price: "25.000đ", image: food }
        ],
        Drinks: [
          { name: "Tra Da", price: "15.000đ", image: food },
          { name: "Sinh To", price: "20.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Goi Cuon", price: "45.000đ", image: food },
          { name: "Nem Ran", price: "30.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Mi Quang", price: "65.000đ", image: food },
          { name: "Hu Tieu", price: "55.000đ", image: food }
        ],
        Dessert: [
          { name: "Sua Chua", price: "20.000đ", image: food },
          { name: "Xoi Xeo", price: "35.000đ", image: food }
        ],
        Drinks: [
          { name: "Bia Hanoi", price: "25.000đ", image: food },
          { name: "Nuoc Dua", price: "20.000đ", image: food }
        ]
      },
      {
        
        Appetizer: [
          { name: "Cha Gio", price: "40.000đ", image: food },
          { name: "Goi Ngot", price: "35.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Com Ga", price: "60.000đ", image: food },
          { name: "Mi Xao", price: "50.000đ", image: food }
        ],
        Dessert: [
          { name: "Che Suong Sao", price: "28.000đ", image: food },
          { name: "Banh Da Lon", price: "22.000đ", image: food }
        ],
        Drinks: [
          { name: "Nuoc Cam", price: "18.000đ", image: food },
          { name: "Sinh To Bo", price: "22.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Thit Kho", price: "55.000đ", image: food },
          { name: "Goi Tom", price: "40.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Com Suon", price: "75.000đ", image: food },
          { name: "Bun Bo", price: "65.000đ", image: food }
        ],
        Dessert: [
          { name: "Che Ba Mau", price: "30.000đ", image: food },
          { name: "Banh Chuoi", price: "25.000đ", image: food }
        ],
        Drinks: [
          { name: "Nuoc Yen", price: "20.000đ", image: food },
          { name: "Nuoc Dua", price: "22.000đ", image: food }
        ]
      }
    ],
    'Italian menu': [
      {
         
        Appetizer: [
          { name: "Bruschetta", price: "60.000đ", image: food },
          { name: "Caprese Salad", price: "70.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Pasta Carbonara", price: "120.000đ", image: food },
          { name: "Margherita Pizza", price: "140.000đ", image: food }
        ],
        Dessert: [
          { name: "Tiramisu", price: "80.000đ", image: food },
          { name: "Panna Cotta", price: "75.000đ", image: food }
        ],
        Drinks: [
          { name: "Espresso", price: "30.000đ", image: food },
          { name: "Chianti", price: "100.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Antipasto", price: "70.000đ", image: food },
          { name: "Garlic Bread", price: "40.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Lasagna", price: "130.000đ", image: food },
          { name: "Risotto", price: "110.000đ", image: food }
        ],
        Dessert: [
          { name: "Gelato", price: "65.000đ", image: food },
          { name: "Cannoli", price: "55.000đ", image: food }
        ],
        Drinks: [
          { name: "Latte", price: "35.000đ", image: food },
          { name: "Prosecco", price: "120.000đ", image: food }
        ]
      },
      {
        
        Appetizer: [
          { name: "Stuffed Mushrooms", price: "65.000đ", image: food },
          { name: "Arancini", price: "50.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Gnocchi", price: "115.000đ", image: food },
          { name: "Osso Buco", price: "140.000đ", image: food }
        ],
        Dessert: [
          { name: "Panna Cotta", price: "75.000đ", image: food },
          { name: "Ricotta Cheesecake", price: "80.000đ", image: food }
        ],
        Drinks: [
          { name: "Americano", price: "30.000đ", image: food },
          { name: "Aperol Spritz", price: "110.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Frittata", price: "60.000đ", image: food },
          { name: "Bruschetta", price: "55.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Spaghetti Bolognese", price: "125.000đ", image: food },
          { name: "Penne Arrabbiata", price: "105.000đ", image: food }
        ],
        Dessert: [
          { name: "Tiramisu", price: "80.000đ", image: food },
          { name: "Zabaglione", price: "70.000đ", image: food }
        ],
        Drinks: [
          { name: "Cappuccino", price: "35.000đ", image: food },
          { name: "Lambrusco", price: "90.000đ", image: food }
        ]
      }
    ],
    'Japanese menu': [
      {
         
        Appetizer: [
          { name: "Edamame", price: "50.000đ", image: food },
          { name: "Miso Soup", price: "40.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Sushi Roll", price: "120.000đ", image: food },
          { name: "Ramen", price: "100.000đ", image: food }
        ],
        Dessert: [
          { name: "Mochi", price: "30.000đ", image: food },
          { name: "Tempura Ice Cream", price: "40.000đ", image: food }
        ],
        Drinks: [
          { name: "Green Tea", price: "20.000đ", image: food },
          { name: "Sake", price: "80.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Gyoza", price: "60.000đ", image: food },
          { name: "Seaweed Salad", price: "50.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Yakitori", price: "110.000đ", image: food },
          { name: "Udon", price: "90.000đ", image: food }
        ],
        Dessert: [
          { name: "Dorayaki", price: "35.000đ", image: food },
          { name: "Anmitsu", price: "30.000đ", image: food }
        ],
        Drinks: [
          { name: "Asahi Beer", price: "50.000đ", image: food },
          { name: "Matcha Latte", price: "35.000đ", image: food }
        ]
      },
      {
        
        Appetizer: [
          { name: "Takoyaki", price: "65.000đ", image: food },
          { name: "Agedashi Tofu", price: "55.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Soba Noodles", price: "95.000đ", image: food },
          { name: "Katsu Curry", price: "120.000đ", image: food }
        ],
        Dessert: [
          { name: "Daifuku", price: "40.000đ", image: food },
          { name: "Yatsuhashi", price: "35.000đ", image: food }
        ],
        Drinks: [
          { name: "Shochu", price: "70.000đ", image: food },
          { name: "Umeshu", price: "60.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Chashu", price: "55.000đ", image: food },
          { name: "Karaage", price: "60.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Tonkotsu Ramen", price: "125.000đ", image: food },
          { name: "Katsudon", price: "110.000đ", image: food }
        ],
        Dessert: [
          { name: "Matcha Cake", price: "45.000đ", image: food },
          { name: "Red Bean Soup", price: "30.000đ", image: food }
        ],
        Drinks: [
          { name: "Iced Green Tea", price: "25.000đ", image: food },
          { name: "Japanese Whiskey", price: "100.000đ", image: food }
        ]
      }
    ],
    'Mexican menu': [
      {
        
        Appetizer: [
          { name: "Nachos", price: "60.000đ", image: food },
          { name: "Guacamole", price: "55.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Tacos", price: "120.000đ", image: food },
          { name: "Enchiladas", price: "130.000đ", image: food }
        ],
        Dessert: [
          { name: "Churros", price: "40.000đ", image: food },
          { name: "Flan", price: "35.000đ", image: food }
        ],
        Drinks: [
          { name: "Margarita", price: "80.000đ", image: food },
          { name: "Tequila", price: "90.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Quesadillas", price: "65.000đ", image: food },
          { name: "Ceviche", price: "70.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Burritos", price: "125.000đ", image: food },
          { name: "Chimichangas", price: "110.000đ", image: food }
        ],
        Dessert: [
          { name: "Tres Leches Cake", price: "50.000đ", image: food },
          { name: "Sopapillas", price: "30.000đ", image: food }
        ],
        Drinks: [
          { name: "Paloma", price: "70.000đ", image: food },
          { name: "Mexican Beer", price: "50.000đ", image: food }
        ]
      },
      {
        
        Appetizer: [
          { name: "Elote", price: "55.000đ", image: food },
          { name: "Mexican Street Corn", price: "60.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Carnitas", price: "130.000đ", image: food },
          { name: "Fajitas", price: "120.000đ", image: food }
        ],
        Dessert: [
          { name: "Cajeta Flan", price: "45.000đ", image: food },
          { name: "Buñuelos", price: "35.000đ", image: food }
        ],
        Drinks: [
          { name: "Michelada", price: "55.000đ", image: food },
          { name: "Horachata", price: "30.000đ", image: food }
        ]
      },
      {
         
        Appetizer: [
          { name: "Tamales", price: "70.000đ", image: food },
          { name: "Tostadas", price: "65.000đ", image: food }
        ],
        "Main dishes": [
          { name: "Pozole", price: "135.000đ", image: food },
          { name: "Mole Poblano", price: "140.000đ", image: food }
        ],
        Dessert: [
          { name: "Arroz Con Leche", price: "40.000đ", image: food },
          { name: "Churros", price: "35.000đ", image: food }
        ],
        Drinks: [
          { name: "Sangria", price: "85.000đ", image: food },
          { name: "Mexican Hot Chocolate", price: "35.000đ", image: food }
        ]
      }
    ]
  };
  

  // Cấu hình cho slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, // Chuyển động mỗi 4 giây
    arrows: true // Hiển thị mũi tên điều hướng
  };

  // Hàm xử lý khi người dùng bấm "View"
  const handleViewClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  // Hàm xử lý khi muốn quay lại trang hiển thị các menu
  const handleBackClick = () => {
    setSelectedMenu(null);
  };

  // Hàm xử lý khi người dùng bấm "Choose"
  const handleChooseClick = (menu) => {
    // Gọi hàm onSelectMenu từ props để truyền dữ liệu qua MenuSuggest
    onSelectMenu(menu);
  };

  return (
    <div>
      {/* Nếu chưa chọn menu nào thì hiển thị danh sách các menu */}
      {selectedMenu === null ? (
        <div className="grid-container">
          {Object.keys(menuData).slice(0, 4).map(menuName => (
            <div key={menuName} className="grid-item">
              <h4>{menuName}</h4>
              <button 
                className="btn color-btn" 
                onClick={() => handleViewClick(menuName)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Khi chọn một menu, hiển thị carousel với các phần của menu theo đúng chủ đề
        <div className="menu-details">
          <h3>{selectedMenu}</h3>
          <button className="btn back-btn" onClick={handleBackClick}>
            Back to Menus
          </button>
          <Slider {...settings} className="carousel">
            {menuData[selectedMenu].map((menu, index) => (
              <div key={index} className="carousel-item">
                <h4>{menu.name}</h4>
                {['Appetizer', 'Main dishes', 'Dessert', 'Drinks'].map((category, catIndex) => (
                  <div key={catIndex} className="menu-section">
                    <h5>{category}</h5>
                    {menu[category] && menu[category].length > 0 && menu[category].map((dish, dishIndex) => (
                      <div key={dishIndex} className="dish-item">
                        <img src={dish.image} alt={dish.name} />
                        <p>{dish.name} - {dish.price}</p>
                      </div>
                    ))}
                  </div>
                ))}
                <button 
                  className="btn choose-btn"
                  onClick={() => handleChooseClick(menu)}
                >
                  Choose
                </button>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default AvailableMenu;
