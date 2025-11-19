// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import axios
// import logo from '../assets/logo.png';

// const LoginPage = () => {
//   const [username, setUsername] = useState(''); // Email or username
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post('http://localhost:8000/login', {
//         email: username, // or use "username" if your backend expects that
//         password
//       });

//       // Handle token storage
//       localStorage.setItem('token', res.data.token);

//       // Navigate to protected route (dashboard/home etc.)
//       navigate('/dashboard'); // Change to your actual route
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   const handleGoToSignup = () => {
//     navigate('/signup');
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginBox}>
//         {/* <img src={logo} alt="Logo" style={styles.logo} /> */}
//         <h1 style={styles.title}>Login</h1>

//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             style={styles.input}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//             required
//           />
//           <button type="submit" style={styles.button}>Login</button>
//         </form>

//         <p style={{ marginTop: '15px' }}>
//           Don't have an account?{' '}
//           <span
//             onClick={handleGoToSignup}
//             style={styles.signupLink}
//           >
//             Sign Up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginBox: {
//     backgroundColor: 'silver',
//     padding: '30px',
//     borderRadius: '10px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     width: '300px',
//     textAlign: 'center',
//   },
//   logo: {
//     width: '80px',
//     height: '80px',
//     objectFit: 'contain',
//     marginBottom: '15px',
//     marginTop: "-7rem",
//   },
//   title: {
//     marginBottom: '20px',
//     fontSize: '24px',
//     fontWeight: 'bold',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     margin: '8px 0',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//   },
//   button: {
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#56CCF2',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
//   signupLink: {
//     color: '#007bff',
//     cursor: 'pointer',
//     textDecoration: 'underline',
//   },
// };

// export default LoginPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// // import logo from '../assets/logo.png'; // Uncomment if you want to use a logo

// const BACKEND_URL = "http://localhost:8000";

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setLoading(true);

//   // ✅ Log data being sent
//   console.log('Sending login data:', { email, password });

//   try {
//     const response = await axios.post(`${BACKEND_URL}/login`, {
//       email,
//       password,
//     });

//     localStorage.setItem('token', response.data.token);
//     navigate('/dashboard');
//   } catch (err) {
//     setError(err.response?.data?.message || 'Login failed. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleGoToSignup = () => {
//     navigate('/signup');
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginBox}>
//         {/* Optional Logo */}
//         {/* <img src={logo} alt="Logo" style={styles.logo} /> */}
        
//         <h1 style={styles.title}>Login</h1>

//         {error && <p role="alert" style={styles.error}>{error}</p>}

//         <form onSubmit={handleSubmit} aria-describedby="error-message">
//           <label htmlFor="email" style={styles.label}>Email</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={styles.input}
//             required
//             autoComplete="username"
//           />

//           <label htmlFor="password" style={styles.label}>Password</label>
//           <input
//             id="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//             required
//             autoComplete="current-password"
//           />

//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p style={{ marginTop: 15 }}>
//           Don't have an account?{' '}
//           <button onClick={handleGoToSignup} style={styles.signupButton} aria-label="Go to signup page">
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginBox: {
//     backgroundColor: 'silver',
//     padding: 30,
//     borderRadius: 10,
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     width: 320,
//     textAlign: 'center',
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     objectFit: 'contain',
//     marginBottom: 15,
//     marginTop: '-7rem',
//   },
//   title: {
//     marginBottom: 20,
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   label: {
//     display: 'block',
//     textAlign: 'left',
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     marginTop: 5,
//     marginBottom: 15,
//     border: '1px solid #ccc',
//     borderRadius: 5,
//     fontSize: 16,
//   },
//   button: {
//     width: '100%',
//     padding: 10,
//     backgroundColor: '#56CCF2',
//     color: '#fff',
//     border: 'none',
//     borderRadius: 5,
//     cursor: 'pointer',
//     fontSize: 16,
//   },
//   signupButton: {
//     background: 'none',
//     border: 'none',
//     padding: 0,
//     color: '#007bff',
//     cursor: 'pointer',
//     textDecoration: 'underline',
//     fontSize: 16,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
// };

// export default LoginPage;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const BACKEND_URL = "http://localhost:8000";

// const LoginPage = () => {
//   const [mode, setMode] = useState("login"); // "login" | "forgot" | "reset"
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [token, setToken] = useState(""); // for reset password
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false); // ✅ popup state
// const [mobile, setMobile] = useState("");
// const [otp, setOtp] = useState("");
// const [otpSending, setOtpSending] = useState(false);

//   const navigate = useNavigate();

//   // ---------- LOGIN ----------
//  const handleLogin = async (e) => {
//   e.preventDefault();
//   setError("");
//   setMessage("");
//   setLoading(true);

//   try {
//     const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
//       email,
//       password,
//     });

//     localStorage.setItem("token", response.data.token);
//     navigate("/dashboard");
//   } catch (err) {
//     setError(err.response?.data?.message || "Login failed. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };


//   // ---------- FORGOT PASSWORD ----------
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BACKEND_URL}/forgot-password`, { email });
//       setMessage(res.data.message || "Password reset link sent to your email.");
//       setMode("reset");
//     } catch (err) {
//       setError(err.response?.data?.message || "Error sending reset link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- RESET PASSWORD ----------
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(`${BACKEND_URL}/reset-password`, {
//         token,
//         password,
//       });
//       setMessage(res.data.message || "Password reset successful!");
//       setShowPopup(true); // ✅ Show popup
//       setTimeout(() => {
//         setShowPopup(false);
//         setMode("login");
//       }, 2500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Error resetting password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoToSignup = () => navigate("/signup");

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginBox}>
//         <h1 style={styles.title}>
//           {mode === "login"
//             ? "Login"
//             : mode === "forgot"
//             ? "Forgot Password"
//             : "Reset Password"}
//         </h1>

//         {error && <p style={styles.error}>⚠️ {error}</p>}
//         {message && <p style={styles.success}>✅ {message}</p>}

//         {/* ---------- LOGIN FORM ---------- */}
//         {mode === "login" && (
//           <form onSubmit={handleLogin}>
//             <label style={styles.label}>Email</label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//               required
//             />

//             <label style={styles.label}>Password</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={styles.input}
//               required
//             />

//             <button style={styles.button} type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p>
//               <button
//                 type="button"
//                 onClick={() => setMode("forgot")}
//                 style={styles.linkButton}
//               >
//                 Forgot Password?
//               </button>
//             </p>

//             <p>
//               Don’t have an account?{" "}
//               <button
//                 onClick={handleGoToSignup}
//                 style={styles.linkButton}
//                 type="button"
//               >
//                 Sign Up
//               </button>
//             </p>
//           </form>
//         )}

//         {/* ---------- FORGOT PASSWORD FORM ---------- */}
//         {mode === "forgot" && (
//   <form
//     onSubmit={async (e) => {
//       e.preventDefault();
//       setError("");
//       setMessage("");

//       if (!otp) {
//         setError("Please enter the OTP sent to your mobile number");
//         return;
//       }

//       if (password !== confirmPassword) {
//         setError("Passwords do not match!");
//         return;
//       }

//       setLoading(true);

//       try {
//         const res = await axios.post(`${BACKEND_URL}/forgot-password/reset`, {
//           mobile,
//           otp,
//           password,
//         });

//         setMessage(res.data.message || "Password successfully reset!");
//         setShowPopup(true);
//         setTimeout(() => {
//           setShowPopup(false);
//           setMode("login");
//         }, 2500);
//       } catch (err) {
//         setError(err.response?.data?.message || "Error resetting password.");
//       } finally {
//         setLoading(false);
//       }
//     }}
//   >
//     {/* Mobile number input */}
//     <label style={styles.label}>Enter your Mobile Number</label>
//     <input
//       type="text"
//       placeholder="Mobile number"
//       value={mobile}
//       onChange={(e) => setMobile(e.target.value)}
//       style={styles.input}
//       required
//     />

//     {/* OTP input */}
//     <label style={styles.label}>Enter OTP</label>
//     <div style={{ display: "flex", gap: "10px" }}>
//       <input
//         type="text"
//         placeholder="Enter OTP"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         style={{ ...styles.input, flex: 1 }}
//         required
//       />
//       <button
//         type="button"
//         style={{ ...styles.button, flex: "0.5" }}
//         disabled={otpSending}
//         onClick={async () => {
//           try {
//             setOtpSending(true);
//             setError("");
//             const res = await axios.post(`${BACKEND_URL}/forgot-password/send-otp`, {
//               mobile,
//             });
//             setMessage(res.data.message || "OTP sent successfully!");
//           } catch (err) {
//             setError(err.response?.data?.message || "Failed to send OTP.");
//           } finally {
//             setOtpSending(false);
//           }
//         }}
//       >
//         {otpSending ? "Sending..." : "Send OTP"}
//       </button>
//     </div>

//     {/* Password inputs */}
//     <label style={styles.label}>New Password</label>
//     <input
//       type="password"
//       placeholder="New password"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       style={styles.input}
//       required
//     />

//     <label style={styles.label}>Confirm Password</label>
//     <input
//       type="password"
//       placeholder="Confirm password"
//       value={confirmPassword}
//       onChange={(e) => setConfirmPassword(e.target.value)}
//       style={styles.input}
//       required
//     />

//     <button style={styles.button} type="submit" disabled={loading}>
//       {loading ? "Submitting..." : "Reset Password"}
//     </button>

//     <p>
//       <button
//         type="button"
//         onClick={() => setMode("login")}
//         style={styles.linkButton}
//       >
//         Back to Login
//       </button>
//     </p>
//   </form>
// )}


//         {/* ---------- RESET PASSWORD FORM ---------- */}
       
//       </div>

//       {/* ✅ POPUP MESSAGE */}
//       {showPopup && (
//         <div style={styles.popupOverlay}>
//           <div style={styles.popupBox}>
//             <h3>✅ Password successfully created!</h3>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ---------- STYLES ----------
// const styles = {
//   container: {
//     backgroundColor: "rgba(255, 255, 255, 0.85)",
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loginBox: {
//     backgroundColor: "white",
//     padding: 30,
//     borderRadius: 10,
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     width: 340,
//     textAlign: "center",
//   },
//   title: { marginBottom: 20, fontSize: 24, fontWeight: "bold" },
//   label: {
//     display: "block",
//     textAlign: "left",
//     marginTop: 10,
//     fontWeight: "600",
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     marginTop: 5,
//     marginBottom: 15,
//     border: "1px solid #ccc",
//     borderRadius: 5,
//     fontSize: 16,
//   },
//   button: {
//     width: "100%",
//     padding: 10,
//     backgroundColor: "#56CCF2",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     cursor: "pointer",
//     fontSize: 16,
//   },
//   linkButton: {
//     background: "none",
//     border: "none",
//     padding: 0,
//     color: "#007bff",
//     cursor: "pointer",
//     textDecoration: "underline",
//     fontSize: 15,
//   },
//   error: {
//     color: "red",
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   success: {
//     color: "green",
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   popupOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popupBox: {
//     background: "#fff",
//     padding: "25px 40px",
//     borderRadius: "10px",
//     boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
//     fontSize: "18px",
//     color: "green",
//     textAlign: "center",
//   },
// };

// export default LoginPage;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css"; // ✅ Import external CSS

const BACKEND_URL = "http://localhost:8000";

const LoginPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  const navigate = useNavigate();

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- FORGOT PASSWORD ----------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/forgot-password`, { email });
      setMessage(res.data.message || "Password reset link sent to your email.");
      setMode("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amazon-login-container">
      <div className="amazon-login-box">
        <h1 className="amazon-title">
          {mode === "login"
            ? "Sign-In"
            : mode === "forgot"
            ? "Forgot Password"
            : "Reset Password"}
        </h1>

        {error && <p className="amazon-error">⚠️ {error}</p>}
        {message && <p className="amazon-success">✅ {message}</p>}

        {/* ---------- LOGIN FORM ---------- */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <label className="amazon-label">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amazon-input"
              required
            />

            <label className="amazon-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amazon-input"
              required
            />

            <button className="amazon-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Continue"}
            </button>

            <p className="amazon-text">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="amazon-link-btn"
              >
                Forgot Password?
              </button>
            </p>

            <p className="amazon-text">
              New to Grapes?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="amazon-link-btn"
                type="button"
              >
                Create your Grapes account
              </button>
            </p>
          </form>
        )}

        {/* ---------- FORGOT PASSWORD FORM ---------- */}
        {mode === "forgot" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setMessage("");

              if (!otp) {
                setError("Please enter the OTP sent to your mobile number");
                return;
              }

              if (password !== confirmPassword) {
                setError("Passwords do not match!");
                return;
              }

              setLoading(true);

              try {
                const res = await axios.post(
                  `${BACKEND_URL}/forgot-password/reset`,
                  { mobile, otp, password }
                );

                setMessage(res.data.message || "Password successfully reset!");
                setShowPopup(true);
                setTimeout(() => {
                  setShowPopup(false);
                  setMode("login");
                }, 2500);
              } catch (err) {
                setError(err.response?.data?.message || "Error resetting password.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="amazon-label">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="amazon-input"
              required
            />

            <label className="amazon-label">OTP</label>
            <div className="amazon-otp-row">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="amazon-input otp-input"
                required
              />
              <button
                type="button"
                className="amazon-btn otp-btn"
                disabled={otpSending}
                onClick={async () => {
                  try {
                    setOtpSending(true);
                    setError("");
                    const res = await axios.post(
                      `${BACKEND_URL}/forgot-password/send-otp`,
                      { mobile }
                    );
                    setMessage(res.data.message || "OTP sent successfully!");
                  } catch (err) {
                    setError(err.response?.data?.message || "Failed to send OTP.");
                  } finally {
                    setOtpSending(false);
                  }
                }}
              >
                {otpSending ? "Sending..." : "Send OTP"}
              </button>
            </div>

            <label className="amazon-label">New Password</label>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amazon-input"
              required
            />

            <label className="amazon-label">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="amazon-input"
              required
            />

            <button className="amazon-btn" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Reset Password"}
            </button>

            <p className="amazon-text">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="amazon-link-btn"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>

      {showPopup && (
        <div className="amazon-popup-overlay">
          <div className="amazon-popup-box">
            <h3>✅ Password successfully created!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
