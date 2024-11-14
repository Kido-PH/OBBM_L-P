// import React, { useState, useEffect } from 'react';
// import { Table, Button, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/orderTracking.css'; // Đảm bảo bạn có file CSS cho các kiểu dáng.

// const OrderTracking = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Giả lập việc lấy dữ liệu đơn hàng từ API
//     const fetchOrders = async () => {
//       try {
//         // Thay thế với API thực tế
//         const response = await fetch('/api/orders');
//         const data = await response.json();
//         setOrders(data);
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to fetch orders.');
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <div className="container">
//       <div className="text-center my-5">
//         <h2>Order Tracking</h2>
//         <p>Track the status of your orders and view the history of your events.</p>
//       </div>

//       {orders.length === 0 ? (
//         <Alert variant="info">No orders found.</Alert>
//       ) : (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Event</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id}>
//                 <td>{order.id}</td>
//                 <td>{new Date(order.date).toLocaleDateString()}</td>
//                 <td>{order.event}</td>
//                 <td>{order.status}</td>
//                 <td>
//                   <Button variant="info" onClick={() => viewDetails(order.id)}>View Details</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// const viewDetails = (orderId) => {
//   // Xử lý xem chi tiết đơn hàng
//   alert(`Viewing details for order ${orderId}`);
// };

// export default OrderTracking;
