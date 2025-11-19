
// import React, { useState } from "react";
// import axios from "axios";
// import LoginPage from "./Login";
// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Validation function
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
//     else if (formData.fullName.trim().length < 2) newErrors.fullName = "Full name must be at least 2 characters";

//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors.email = "Invalid email format";

//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
//     else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

//     if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
//     else if (!/^\d{10}$/.test(formData.mobile.trim())) newErrors.mobile = "Enter a valid 10-digit mobile number";

//     return newErrors;
//   };

//   // Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   // Form submit handler
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const newErrors = validate();
//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

//     // 1️⃣ Signup request
//     const signupResponse = await axios.post(
//       `${BASE_URL}/signup`,
//       {
//         fullName: formData.fullName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         mobile: formData.mobile.trim(),
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//         timeout: 10000,
//       }
//     );

//     alert(signupResponse.data.message || "Signup successful! Please login.");

//     // 2️⃣ Upload JSON to /upload-json
//     const jsonData = { task: "Learn Node.js", completed: false }; // your JSON
//     const uploadResponse = await fetch(`${BASE_URL}/upload-json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jsonData),
//     });

//     const uploadResult = await uploadResponse.json();
//     console.log("JSON upload result:", uploadResult);

//     // Reset form and redirect
//     setFormData({ fullName: "", email: "", password: "", confirmPassword: "", mobile: "" });
//     setErrors({});
//     setTimeout(() => (window.location.href = "/login"), 1000);

//   } catch (err) {
//     if (err.response) {
//       const serverErrors = err.response.data?.errors || {};
//       setErrors(serverErrors);
//       const message = err.response.data?.message || err.response.data?.error;
//       if (message) alert(message);
//     } else if (err.request) {
//       alert("Cannot connect to server. Please check your connection.");
//     } else {
//       alert("An unexpected error occurred. Please try again.");
//     }
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Create Your Account</h2>
//       <form onSubmit={handleSubmit} style={styles.form} noValidate>
//         {["fullName", "email", "password", "confirmPassword", "mobile"].map(field => {
//           const placeholders = {
//             fullName: "Full Name",
//             email: "Email",
//             password: "Password (min 6 chars)",
//             confirmPassword: "Confirm Password",
//             mobile: "Mobile Number (10 digits)"
//           };
//           const types = {
//             fullName: "text",
//             email: "email",
//             password: "password",
//             confirmPassword: "password",
//             mobile: "tel"
//           };
//           const autoComplete = {
//             fullName: "name",
//             email: "email",
//             password: "new-password",
//             confirmPassword: "new-password",
//             mobile: "tel"
//           };

//           return (
//             <div style={styles.inputGroup} key={field}>
//               <input
//                 style={{ ...styles.input, ...(errors[field] && styles.inputError) }}
//                 type={types[field]}
//                 name={field}
//                 placeholder={placeholders[field]}
//                 value={formData[field]}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//                 maxLength={field === "mobile" ? 10 : undefined}
//                 autoComplete={autoComplete[field]}
//               />
//               {errors[field] && <p style={styles.error}>{errors[field]}</p>}
//             </div>
//           );
//         })}

//         <button
//           type="submit"
//           style={{ ...styles.submitButton, ...(isSubmitting && styles.submitButtonDisabled) }}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating Account..." : "Sign Up"}
//         </button>

//         {/* <p style={styles.loginLink}>
//           Already have an account? <a href="/login" style={styles.link}>Login here</a>
//         </p> */}
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: { maxWidth: "420px", margin: "60px auto", padding: "30px", backgroundColor: "#f5f5f5", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)" },
//   title: { textAlign: "center", marginBottom: "25px", color: "#333", fontSize: "24px", fontWeight: "600" },
//   form: { display: "flex", flexDirection: "column", gap: "16px" },
//   inputGroup: { display: "flex", flexDirection: "column" },
//   input: { padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", transition: "border-color 0.3s", outline: "none" },
//   inputError: { borderColor: "#dc3545" },
//   submitButton: { backgroundColor: "#28a745", color: "white", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", fontWeight: "bold", fontSize: "16px", transition: "background-color 0.3s" },
//   submitButtonDisabled: { backgroundColor: "#6c757d", cursor: "not-allowed" },
//   error: { color: "#dc3545", fontSize: "13px", marginTop: "4px", marginBottom: "0" },
//   loginLink: { textAlign: "center", marginTop: "10px", fontSize: "14px", color: "#666" },
//   link: { color: "#007bff", textDecoration: "none", fontWeight: "500" },
// };

// export default SignupPage;



// import React, { useState } from "react";
// import axios from "axios";
// import LoginPage from "./Login";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ popup state

//   // Validation function
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
//     else if (formData.fullName.trim().length < 2) newErrors.fullName = "Full name must be at least 2 characters";

//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors.email = "Invalid email format";

//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
//     else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

//     if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
//     else if (!/^\d{10}$/.test(formData.mobile.trim())) newErrors.mobile = "Enter a valid 10-digit mobile number";

//     return newErrors;
//   };

//   // Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Form submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = validate();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

//       // 1️⃣ Signup request
//       const signupResponse = await axios.post(
//         `${BASE_URL}/signup`,
//         {
//           fullName: formData.fullName.trim(),
//           email: formData.email.trim().toLowerCase(),
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//           mobile: formData.mobile.trim(),
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           timeout: 10000,
//         }
//       );

//       console.log(signupResponse.data.message || "Signup successful! Please login.");

//       // 2️⃣ Upload JSON to /upload-json
//       const jsonData = { task: "Learn Node.js", completed: false };
//       const uploadResponse = await fetch(`${BASE_URL}/upload-json`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jsonData),
//       });

//       const uploadResult = await uploadResponse.json();
//       console.log("JSON upload result:", uploadResult);

//       // ✅ Show success popup instead of alert
//       setShowSuccessPopup(true);

//       // Reset form
//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         mobile: "",
//       });
//       setErrors({});

//       // ⏳ Redirect to login page after 2 seconds
//       setTimeout(() => {
//         setShowSuccessPopup(false);
//         window.location.href = "/login";
//       }, 2000);

//     } catch (err) {
//       if (err.response) {
//         const serverErrors = err.response.data?.errors || {};
//         setErrors(serverErrors);
//         const message = err.response.data?.message || err.response.data?.error;
//         if (message) alert(message);
//       } else if (err.request) {
//         alert("Cannot connect to server. Please check your connection.");
//       } else {
//         alert("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Create Your Account</h2>

//       <form onSubmit={handleSubmit} style={styles.form} noValidate>
//         {["fullName", "email", "password", "confirmPassword", "mobile"].map((field) => {
//           const placeholders = {
//             fullName: "Full Name",
//             email: "Email",
//             password: "Password (min 6 chars)",
//             confirmPassword: "Confirm Password",
//             mobile: "Mobile Number (10 digits)",
//           };
//           const types = {
//             fullName: "text",
//             email: "email",
//             password: "password",
//             confirmPassword: "password",
//             mobile: "tel",
//           };
//           const autoComplete = {
//             fullName: "name",
//             email: "email",
//             password: "new-password",
//             confirmPassword: "new-password",
//             mobile: "tel",
//           };

//           return (
//             <div style={styles.inputGroup} key={field}>
//               <input
//                 style={{ ...styles.input, ...(errors[field] && styles.inputError) }}
//                 type={types[field]}
//                 name={field}
//                 placeholder={placeholders[field]}
//                 value={formData[field]}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//                 maxLength={field === "mobile" ? 10 : undefined}
//                 autoComplete={autoComplete[field]}
//               />
//               {errors[field] && <p style={styles.error}>{errors[field]}</p>}
//             </div>
//           );
//         })}

//         <button
//           type="submit"
//           style={{
//             ...styles.submitButton,
//             ...(isSubmitting && styles.submitButtonDisabled),
//           }}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating Account..." : "Sign Up"}
//         </button>
//       </form>

//       {/* ✅ Success Popup */}
//       {showSuccessPopup && (
//         <div style={styles.popupOverlay}>
//           <div style={styles.popupBox}>
//             <h3 style={{ color: "#28a745" }}>🎉 Account Created Successfully!</h3>
//             <p style={{ color: "#555" }}>Redirecting to login page...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "420px",
//     margin: "60px auto",
//     padding: "30px",
//     backgroundColor: "#f5f5f5",
//     borderRadius: "10px",
//     boxShadow: "0 0 15px rgba(0,0,0,0.1)",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "25px",
//     color: "#333",
//     fontSize: "24px",
//     fontWeight: "600",
//   },
//   form: { display: "flex", flexDirection: "column", gap: "16px" },
//   inputGroup: { display: "flex", flexDirection: "column" },
//   input: {
//     padding: "12px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//     transition: "border-color 0.3s",
//     outline: "none",
//   },
//   inputError: { borderColor: "#dc3545" },
//   submitButton: {
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     padding: "12px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     marginTop: "10px",
//     fontWeight: "bold",
//     fontSize: "16px",
//     transition: "background-color 0.3s",
//   },
//   submitButtonDisabled: { backgroundColor: "#6c757d", cursor: "not-allowed" },
//   error: {
//     color: "#dc3545",
//     fontSize: "13px",
//     marginTop: "4px",
//     marginBottom: "0",
//   },

//   // ✅ Popup styles
//   popupOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   popupBox: {
//     background: "#fff",
//     padding: "30px 40px",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.3)",
//     textAlign: "center",
//     animation: "fadeIn 0.3s ease-in-out",
//   },
// };

// export default SignupPage;




// import React, { useState } from "react";
// import axios from "axios";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [serverError, setServerError] = useState("");

//   // Validation function
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     } else if (formData.fullName.trim().length < 2) {
//       newErrors.fullName = "Full name must be at least 2 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (!/^\d{10,15}$/.test(formData.mobile.trim())) {
//       newErrors.mobile = "Enter a valid mobile number (10-15 digits)";
//     }

//     return newErrors;
//   };

//   // Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
    
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
    
//     if (serverError) {
//       setServerError("");
//     }
//   };

//   // Form submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear previous errors
//     setErrors({});
//     setServerError("");

//     // Validate form
//     const newErrors = validate();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

//       console.log("🔵 Sending signup request...");

//       // Signup request
//       const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`,
//         {
//           fullName: formData.fullName.trim(),
//           email: formData.email.trim().toLowerCase(),
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//           mobile: formData.mobile.trim(),
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           timeout: 10000,
//         }
//       );

//       console.log("✅ Signup successful:", signupResponse.data);

//       // Optional: Upload JSON data (non-critical)
//       try {
//         const jsonData = { 
//           task: "Learn Node.js", 
//           completed: false,
//           userId: signupResponse.data.user?.id,
//           createdAt: new Date().toISOString()
//         };
        
//         await axios.post(`${BASE_URL}/upload-json`, jsonData, {
//           headers: { "Content-Type": "application/json" },
//           timeout: 5000,
//         });
        
//         console.log("✅ JSON data uploaded");
//       } catch (uploadErr) {
//         console.warn("⚠️ JSON upload failed (non-critical):", uploadErr.message);
//       }

//       // Show success popup
//       setShowSuccessPopup(true);

//       // Reset form
//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         mobile: "",
//       });

//       // Redirect to login page after 2 seconds
//       setTimeout(() => {
//         setShowSuccessPopup(false);
//         window.location.href = "/Login";
//       }, 2000);

//     } catch (err) {
//       console.error("❌ Signup error:", err);

//       if (err.response) {
//         // Server responded with error
//         const errorMessage = err.response.data?.message || "Registration failed";
//         setServerError(errorMessage);

//         // Handle field-specific errors from server
//         if (err.response.data?.errors) {
//           setErrors(err.response.data.errors);
//         }

//         // Log for debugging
//         console.error("Server error response:", err.response.data);
//         console.error("Status code:", err.response.status);

//       } else if (err.request) {
//         // Request made but no response
//         setServerError("Cannot connect to server. Please check your connection.");
//       } else {
//         // Something else happened
//         setServerError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Create Your Account</h2>

//       {/* Server error display */}
//       {serverError && (
//         <div style={styles.serverErrorBox}>
//           <p style={styles.serverErrorText}>⚠️ {serverError}</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} style={styles.form} noValidate>
//         {[
//           { name: "fullName", placeholder: "Full Name", type: "text", autoComplete: "name" },
//           { name: "email", placeholder: "Email", type: "email", autoComplete: "email" },
//           { name: "password", placeholder: "Password (min 6 chars)", type: "password", autoComplete: "new-password" },
//           { name: "confirmPassword", placeholder: "Confirm Password", type: "password", autoComplete: "new-password" },
//           { name: "mobile", placeholder: "Mobile Number (10-15 digits)", type: "tel", autoComplete: "tel", maxLength: 15 },
//         ].map((field) => (
//           <div style={styles.inputGroup} key={field.name}>
//             <input
//               style={{
//                 ...styles.input,
//                 ...(errors[field.name] && styles.inputError),
//               }}
//               type={field.type}
//               name={field.name}
//               placeholder={field.placeholder}
//               value={formData[field.name]}
//               onChange={handleInputChange}
//               disabled={isSubmitting}
//               maxLength={field.maxLength}
//               autoComplete={field.autoComplete}
//             />
//             {errors[field.name] && (
//               <p style={styles.error}>
//                 {errors[field.name]}
//               </p>
//             )}
//           </div>
//         ))}

//         <button
//           type="submit"
//           style={{
//             ...styles.submitButton,
//             ...(isSubmitting && styles.submitButtonDisabled),
//           }}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating Account..." : "Sign Up"}
//         </button>

//         <p style={styles.loginLink}>
//           Already have an account?{" "}
//           <a href="/login" style={styles.link}>
//             Login here
//           </a>
//         </p>
//       </form>

//       {/* Success Popup */}
//       {showSuccessPopup && (
//         <div style={styles.popupOverlay}>
//           <div style={styles.popupBox}>
//             <div style={styles.successIcon}>✓</div>
//             <h3 style={styles.successTitle}>Account Created Successfully!</h3>
//             <p style={styles.successText}>Redirecting to login page...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "440px",
//     margin: "60px auto",
//     padding: "35px",
//     backgroundColor: "white",
//     borderRadius: "12px",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "25px",
//     color: "#333",
//     fontSize: "26px",
//     fontWeight: "600",
//   },
//   serverErrorBox: {
//     backgroundColor: "#fee",
//     border: "1px solid #fcc",
//     borderRadius: "8px",
//     padding: "12px 16px",
//     marginBottom: "20px",
//   },
//   serverErrorText: {
//     color: "#c33",
//     fontSize: "14px",
//     margin: 0,
//     textAlign: "center",
//   },
//   form: { 
//     display: "flex", 
//     flexDirection: "column", 
//     gap: "18px" 
//   },
//   inputGroup: { 
//     display: "flex", 
//     flexDirection: "column" 
//   },
//   input: {
//     padding: "14px",
//     borderRadius: "8px",
//     border: "1px solid #ddd",
//     fontSize: "15px",
//     transition: "all 0.3s",
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   inputError: { 
//     borderColor: "#dc3545",
//     backgroundColor: "#fff5f5"
//   },
//   submitButton: {
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     padding: "14px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginTop: "10px",
//     fontWeight: "600",
//     fontSize: "16px",
//     transition: "all 0.3s",
//     boxShadow: "0 2px 8px rgba(40,167,69,0.3)",
//   },
//   submitButtonDisabled: { 
//     backgroundColor: "#95c9a3", 
//     cursor: "not-allowed",
//     boxShadow: "none"
//   },
//   error: {
//     color: "#dc3545",
//     fontSize: "13px",
//     marginTop: "6px",
//     marginBottom: "0",
//   },
//   loginLink: {
//     textAlign: "center",
//     marginTop: "15px",
//     fontSize: "14px",
//     color: "#666",
//   },
//   link: {
//     color: "#28a745",
//     textDecoration: "none",
//     fontWeight: "600",
//   },
//   popupOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.6)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   popupBox: {
//     background: "#fff",
//     padding: "40px 50px",
//     borderRadius: "12px",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//     textAlign: "center",
//     maxWidth: "400px",
//   },
//   successIcon: {
//     width: "60px",
//     height: "60px",
//     borderRadius: "50%",
//     backgroundColor: "#28a745",
//     color: "white",
//     fontSize: "36px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 20px",
//     fontWeight: "bold",
//   },
//   successTitle: {
//     color: "#28a745",
//     marginBottom: "10px",
//     fontSize: "22px",
//     fontWeight: "600",
//   },
//   successText: {
//     color: "#666",
//     fontSize: "15px",
//     margin: 0,
//   },
// };

// export default SignupPage;



import React, { useState } from "react";
import axios from "axios";
import "../css/signup.css"; // ✅ external CSS import

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2)
      newErrors.fullName = "Full name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10,15}$/.test(formData.mobile.trim()))
      newErrors.mobile = "Enter a valid mobile number (10-15 digits)";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Signup successful:", res.data);

      setShowSuccessPopup(true);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
      });

      setTimeout(() => {
        setShowSuccessPopup(false);
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("❌ Signup error:", err);
      if (err.response) {
        setServerError(err.response.data?.message || "Registration failed");
      } else {
        setServerError("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="amazon-signup-container">
      <div className="amazon-signup-box">
        <h2 className="amazon-signup-title">Create Account</h2>

        {serverError && (
          <div className="amazon-server-error">
            <p>⚠️ {serverError}</p>
          </div>
        )}

        <form className="amazon-signup-form" onSubmit={handleSubmit} noValidate>
          {[
            { name: "fullName", placeholder: "Full Name", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
            {
              name: "confirmPassword",
              placeholder: "Confirm Password",
              type: "password",
            },
            { name: "mobile", placeholder: "Mobile Number", type: "tel" },
          ].map((field) => (
            <div className="amazon-input-group" key={field.name}>
              <input
                className={`amazon-input ${
                  errors[field.name] ? "amazon-input-error" : ""
                }`}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleInputChange}
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors[field.name] && (
                <p className="amazon-error-text">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className={`amazon-submit-btn ${
              isSubmitting ? "amazon-submit-disabled" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Continue"}
          </button>

          <p className="amazon-login-link">
            Already have an account?{" "}
            <a href="/login" className="amazon-link">
              Sign in
            </a>
          </p>
        </form>
      </div>

      {showSuccessPopup && (
        <div className="amazon-popup-overlay">
          <div className="amazon-popup-box">
            <div className="amazon-success-icon">✓</div>
            <h3>Account Created Successfully!</h3>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
