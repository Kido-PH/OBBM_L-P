// import React, { useState } from 'react';
// import { Button, Form, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/pay.css'; // Đảm bảo bạn có file CSS cho các kiểu dáng.

// const Pay = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: ''
//   });
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Giả lập thanh toán thành công
//     if (formData.name && formData.email && formData.cardNumber && formData.expiryDate && formData.cvv && formData.amount) {
//       setAlertMessage('Payment Successful!');
//       setShowAlert(true);
//       // Xử lý thanh toán ở đây
//     } else {
//       setAlertMessage('Please fill out all fields.');
//       setShowAlert(true);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="text-center my-5">
//         <h2>Payment Information</h2>
//         <p>Please fill out the form below to complete your payment.</p>
//       </div>

//       {showAlert && (
//         <Alert variant={alertMessage.includes('Successful') ? 'success' : 'danger'} onClose={() => setShowAlert(false)} dismissible>
//           {alertMessage}
//         </Alert>
//       )}

//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="formName">
//           <Form.Label>Name</Form.Label>
//           <Form.Control
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter your name"
//           />
//         </Form.Group>

//         <Form.Group controlId="formEmail">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//           />
//         </Form.Group>

//         <Form.Group controlId="formCardNumber">
//           <Form.Label>Card Number</Form.Label>
//           <Form.Control
//             type="text"
//             name="cardNumber"
//             value={formData.cardNumber}
//             onChange={handleChange}
//             placeholder="Enter your card number"
//           />
//         </Form.Group>

//         <Form.Group controlId="formExpiryDate">
//           <Form.Label>Expiry Date</Form.Label>
//           <Form.Control
//             type="text"
//             name="expiryDate"
//             value={formData.expiryDate}
//             onChange={handleChange}
//             placeholder="MM/YY"
//           />
//         </Form.Group>

//         <Form.Group controlId="formCvv">
//           <Form.Label>CVV</Form.Label>
//           <Form.Control
//             type="text"
//             name="cvv"
//             value={formData.cvv}
//             onChange={handleChange}
//             placeholder="Enter your CVV"
//           />
//         </Form.Group>

//         <Form.Group controlId="formAmount">
//           <Form.Label>Amount</Form.Label>
//           <Form.Control
//             type="text"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             placeholder="Enter amount to pay"
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit">
//           Submit Payment
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default Pay;
