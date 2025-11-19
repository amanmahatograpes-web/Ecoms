// import React from 'react';
// import Login from './Auth/Login';

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Auth/Login';
// import Signup from './Auth/Signup'; 
// import SellerRegistrationform from './Auth/SellerRegistrationform';
// import Curdoperation from './Productmanagement/Curdoperation';
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//           <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />  
//          {/* <Route path="/" element={<SellerRegistrationform />} /> 

//         <Route path="/" element={<Curdoperation />} />  */}

//       </Routes>
//     </Router>
//   );
// };

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Auth/Login';
import Signup from './Auth/Signup'; 
import SellerRegistrationform from './Auth/SellerRegistrationform';
import Products from "./Components/Products"; 
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default: Login */}
      {/* <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> */}

        {/* Signup Route */}
        {/* <Route path="/signup" element={<Signup />} />  */}
               {/* {/* <Route path="/" element={<Rolepermission/>} */}
 <Route path="/" element={<Products />} />

      </Routes>
    </Router>
  );
};

export default App;







// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import ProductList from "./pages/ProductList";
// import ProductWizard from "./pages/ProductWizard";
// import BulkUpload from "./pages/BulkUpload";
// import Analytics from "./pages/Analytics";
// import Reports from "./pages/Reports";
// import Settings from "./pages/Settings";
// import "./styles/components.css";

// export default function App() {
//   return (
//     <div className="app-shell">
//       <header className="app-header">
//         <div className="brand">Seller Center</div>
//         <nav className="top-nav">
//           <Link to="/">Dashboard</Link>
//           <Link to="/products">Products</Link>
//           <Link to="/create">Create</Link>
//           <Link to="/upload">Bulk Upload</Link>
//           <Link to="/analytics">Analytics</Link>
//           <Link to="/reports">Reports</Link>
//           <Link to="/settings">Settings</Link>
//         </nav>
//       </header>

//       <main className="app-main">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/products" element={<ProductList />} />
//           <Route path="/create" element={<ProductWizard />} />
//           <Route path="/upload" element={<BulkUpload />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/settings" element={<Settings />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }



// import axios from "axios";
// const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// export const api = axios.create({
//   baseURL: `${BASE}/api`,
//   timeout: 15000
// });




// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";
// import "./styles/global.css";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/*" element={<App />} />
//     </Routes>
//   </BrowserRouter>
// );
