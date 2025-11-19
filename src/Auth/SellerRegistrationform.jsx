// import React, { useState } from 'react';
// import axios from 'axios';

// const SellerRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     address: '',
//     contact: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setErrors({});
//     setSuccessMessage('');
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email ID is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

//     if (!formData.address.trim()) newErrors.address = 'Address is required';

//     if (!/^\d{10}$/.test(formData.contact))
//       newErrors.contact = 'Enter valid 10-digit contact number';

//     if (!formData.password) newErrors.password = 'Password is required';
//     else if (formData.password.length < 6)
//       newErrors.password = 'Password must be at least 6 characters';

//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = 'Passwords do not match';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:8000/api/sellers/register', formData);

//       if (res.data.success) {
//         setSuccessMessage('✅ Seller registered successfully!');
//         setFormData({
//           fullName: '',
//           email: '',
//           address: '',
//           contact: '',
//           password: '',
//           confirmPassword: '',
//         });
//       } else {
//         setErrors({ apiError: res.data.message });
//       }
//     } catch (err) {
//       setErrors({ apiError: err.response?.data?.message || 'Registration failed!' });
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formBox}>
//         <h2 style={styles.title}>Seller Registration</h2>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <label style={styles.label}>Full Name</label>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}

//           <label style={styles.label}>Email ID</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.email && <p style={styles.error}>{errors.email}</p>}

//           <label style={styles.label}>Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             rows={3}
//             style={styles.input}
//           />
//           {errors.address && <p style={styles.error}>{errors.address}</p>}

//           <label style={styles.label}>Contact Number</label>
//           <input
//             type="text"
//             name="contact"
//             value={formData.contact}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.contact && <p style={styles.error}>{errors.contact}</p>}

//           <label style={styles.label}>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.password && <p style={styles.error}>{errors.password}</p>}

//           <label style={styles.label}>Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}

//           {errors.apiError && <p style={styles.error}>{errors.apiError}</p>}
//           {successMessage && <p style={styles.success}>{successMessage}</p>}

//           <button type="submit" style={styles.button}>Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ✅ Inline CSS styles
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: 'white',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '20px',
//   },
//   formBox: {
//     width: '100%',
//     maxWidth: '500px',
//     backgroundColor: 'white',
//     padding: '30px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: '25px',
//     fontSize: '24px',
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   label: {
//     marginBottom: '5px',
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   input: {
//     marginBottom: '15px',
//     padding: '10px',
//     fontSize: '16px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   button: {
//     padding: '12px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     fontSize: '16px',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
//   error: {
//     color: 'red',
//     fontSize: '14px',
//     marginTop: '-10px',
//     marginBottom: '10px',
//   },
//   success: {
//     color: 'green',
//     fontSize: '15px',
//     textAlign: 'center',
//     marginBottom: '10px',
//   },
// };

// export default SellerRegistrationForm;




import React, { useState } from "react";
import axios from "axios";
import "../css/SellerRegistration.css"; // ✅ External CSS

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
    setSuccessMessage("");
  };

  // Validate Form Data
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email ID is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!/^\d{10}$/.test(formData.contact))
      newErrors.contact = "Enter valid 10-digit contact number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/sellers/register",
        formData
      );

      if (res.data.success) {
        setSuccessMessage("✅ Seller registered successfully!");
        setFormData({
          fullName: "",
          email: "",
          address: "",
          contact: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setErrors({ apiError: res.data.message });
      }
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.message || "Registration failed!",
      });
    }
  };

  return (
    <div className="seller-container">
      <div className="seller-box">
        <h2 className="seller-title">Seller Registration</h2>

        {errors.apiError && <p className="seller-error">{errors.apiError}</p>}
        {successMessage && <p className="seller-success">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="seller-form">
          <label className="seller-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="seller-input"
          />
          {errors.fullName && <p className="seller-error">{errors.fullName}</p>}

          <label className="seller-label">Email ID</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="seller-input"
          />
          {errors.email && <p className="seller-error">{errors.email}</p>}

          <label className="seller-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="seller-textarea"
          />
          {errors.address && <p className="seller-error">{errors.address}</p>}

          <label className="seller-label">Contact Number</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="seller-input"
          />
          {errors.contact && <p className="seller-error">{errors.contact}</p>}

          <label className="seller-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="seller-input"
          />
          {errors.password && <p className="seller-error">{errors.password}</p>}

          <label className="seller-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="seller-input"
          />
          {errors.confirmPassword && (
            <p className="seller-error">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="seller-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;
