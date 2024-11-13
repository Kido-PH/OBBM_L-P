// import React from 'react';
// import './css/menu.css';
// import { Button, Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import food from "./images/food-menu-5.png";

// const Menu = () => {
//   const [modalShow, setModalShow] = React.useState(false);
//   const [currentModal, setCurrentModal] = React.useState('');

//   const handleModalShow = (modalType) => {
//     setCurrentModal(modalType);
//     setModalShow(true);
//   };

//   const handleModalClose = () => setModalShow(false);

//   return (
//     <div className="container">
//       <div className="text-center my-5">
//         <h2 className="font-weight-light">
//           Our <span className="text-warning">Menu</span>
//         </h2>
//         <p>Choose the menu according to your preferences.</p>
//       </div>
//       <div className="row">
//         <div className="col-md-8">
//           <div className="row">
//             <div className="col-md-6">
//               <div className="menu bg-light p-3 mb-3">
//                 <h3>Your Menu</h3>
//                 <MenuSection
//                   title="Appetizer"
//                   onButtonClick={() => handleModalShow('khaiVi')}
//                 />
//                 <MenuSection
//                   title="Main dishes"
//                   onButtonClick={() => handleModalShow('monChinh')}
//                 />
//                 <MenuSection
//                   title="Dessert"
//                   onButtonClick={() => handleModalShow('trangMieng')}
//                 />
//                 <div className="d-flex justify-content-center mt-3">
//                   <Button className="btn-warning mr-2">View Menu</Button>
//                   <Button className="btn-warning ml-2">Create Menu</Button>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="menu bg-light p-3 mb-3">
//                 <h3>Menu Suggest</h3>
//                 <MenuSection
//                   title="Appetizer"
//                   items={[
//                     { name: 'Bánh Plan', price: '20.000đ', image: food },
//                   ]}
//                 />
//                 <MenuSection
//                   title="Main dishes"
//                   items={[
//                     { name: 'Pizza Margherita', price: '80.000đ', image: food },
//                   ]}
//                 />
//                 <MenuSection
//                   title="Dessert"
//                   items={[
//                     { name: 'Tiramisu', price: '25.000đ', image: food },
//                   ]}
//                 />
//                 <div className="d-flex justify-content-center mt-3">
//                   <Button className="btn-warning">Choose Menu</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="small-menus">
//             <SmallMenu title="Japanese menu" onButtonClick={() => alert('Load Japanese menu clicked')} />
//             <SmallMenu title="Italian menu" onButtonClick={() => alert('Load Italian menu clicked')} />
//             <SmallMenu title="Chinese menu" onButtonClick={() => alert('Load Chinese menu clicked')} />
//           </div>
//         </div>
//       </div>

//       <MenuModal
//         show={modalShow}
//         onHide={handleModalClose}
//         type={currentModal}
//       />
//     </div>
//   );
// };

// const MenuSection = ({ title, items = [], onButtonClick }) => (
//   <div className="menu-section mb-3 position-relative">
//     <h4>{title}</h4>
//     {onButtonClick && (
//       <Button
//         variant="link"
//         className="position-absolute"
//         style={{ top: '10px', right: '10px', fontSize: '1.5rem' }}
//         onClick={onButtonClick}
//       >
//         +
//       </Button>
//     )}
//     <div className="row">
//       {items.map((item, index) => (
//         <div key={index} className="col-md-6 dish-item d-flex align-items-center mb-2">
//           <img src={item.image} alt={item.name} className="img-fluid" style={{ width: '100px' }} />
//           <div className="ml-2">
//             <div className="name">{item.name}</div>
//             <div className="price font-weight-bold">{item.price}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const SmallMenu = ({ title, onButtonClick }) => (
//   <div className="small-menu mb-3 p-3 bg-white shadow-sm rounded">
//     <h4 className="d-flex justify-content-between align-items-center">
//       {title}
//       <Button className="btn-warning" onClick={onButtonClick}>
//         View
//       </Button>
//     </h4>
//   </div>
// );

// const MenuModal = ({ show, onHide, type }) => {
//   const menuItems = {
//     khaiVi: [
//       { name: 'Appetizer 1', price: '10.000đ' },
//       { name: 'Appetizer 2', price: '15.000đ' }
//     ],
//     monChinh: [
//       { name: 'Main Dish 1', price: '40.000đ' },
//       { name: 'Main Dish 2', price: '50.000đ' }
//     ],
//     trangMieng: [
//       { name: 'Dessert 1', price: '20.000đ' },
//       { name: 'Dessert 2', price: '25.000đ' }
//     ],
//   };

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>{type === 'khaiVi' ? 'Appetizer' : type === 'monChinh' ? 'Main dishes' : 'Dessert'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {menuItems[type]?.map((item, index) => (
//           <div key={index} className="dish-item d-flex justify-content-between mb-2">
//             <div className="name">{item.name}</div>
//             <div className="price">{item.price}</div>
//           </div>
//         ))}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Menu;
