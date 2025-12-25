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



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Testi from "./Components/Testi.js";
// // import Login from './Auth/Login';
// // import Signup from './Auth/Signup'; 
// // import SellerRegistrationform from './Auth/SellerRegistrationform';
// // import Text from "./Components/Test.js"; 
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Default: Login */}
//       {/* <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} /> */}

//         {/* Signup Route */}
//         {/* <Route path="/signup" element={<Signup />} />  */}
//                {/* {/* <Route path="/" element={<Rolepermission/>} */}
//  <Route path="/" element={ <Testi/>} />

//       </Routes>
//     </Router>
//   );
// };

// export default App;

import { useState } from "react";
import Dashboard from "./Components/Dashboard";

// ------- ALL YOUR IMPORTS (unchanged) -------
import Sidebar from "./Components/Sidebar"; // <-- will not be used directly now

// CATALOGUE
import AddProduct from "./pages/catalogue/AddProduct";
import AddProductsUpload from "./pages/catalogue/AddProductsUpload";
import Drafts from "./pages/catalogue/Drafts";
import Applications from "./pages/catalogue/Applications";
import UploadImages from "./pages/catalogue/UploadImages";
import UploadVideos from "./pages/catalogue/UploadVideos";
import Inventory from "./pages/catalogue/Inventory";

// INVENTORY
import ManageInventory from "./pages/inventory/ManageInventory";
import ManageFBA from "./pages/inventory/ManageFBA";
import Planning from "./pages/inventory/Planning";
import Restock from "./pages/inventory/Restock";

// PRICING
import ManagePricing from "./pages/pricing/ManagePricing";
import AutoPricing from "./pages/pricing/AutoPricing";
import FeeDiscounts from "./pages/pricing/FeeDiscounts";

// ORDERS
import ManageOrders from "./pages/orders/ManageOrders";
import ReturnRequests from "./pages/orders/ReturnRequests";
import CancelledOrders from "./pages/orders/CancelledOrders";
import ShipmentReports from "./pages/orders/ShipmentReports";

// ADVERTISING
import CampaignManager from "./pages/advertising/CampaignManager";
import CreateCampaign from "./pages/advertising/CreateCampaign";
import SponsoredProducts from "./pages/advertising/SponsoredProducts";
import SponsoredBrands from "./pages/advertising/SponsoredBrands";
import SponsoredDisplay from "./pages/advertising/SponsoredDisplay";

// GROWTH
import GrowthOpportunities from "./pages/growth/GrowthOpportunities";
import BrandAnalytics from "./pages/growth/BrandAnalytics";
import Deals from "./pages/growth/Deals";
import Coupons from "./pages/growth/Coupons";

// REPORTS
import BusinessReports from "./pages/reports/BusinessReports";
import InventoryReports from "./pages/reports/InventoryReports";
import ReturnReports from "./pages/reports/ReturnReports";
import PaymentReports from "./pages/reports/PaymentReports";

// PAYMENTS
import PaymentSummary from "./pages/payments/PaymentSummary";
import TransactionView from "./pages/payments/TransactionView";
import InvoiceReports from "./pages/payments/InvoiceReports";

// PERFORMANCE
import AccountHealth from "./pages/performance/AccountHealth";
import CustomerFeedback from "./pages/performance/CustomerFeedback";
import DeliveryPerformance from "./pages/performance/DeliveryPerformance";

// PARTNER NETWORK
import ServiceProviders from "./pages/partner-network/ServiceProviders";
import AmazonPartners from "./pages/partner-network/AmazonPartners";
import IntegrationTools from "./pages/partner-network/IntegrationTools";

// SERVICES
import FbaServices from "./pages/services/FbaServices";
import Logistics from "./pages/services/Logistics";
import ProductPhotos from "./pages/services/ProductPhotos";
import BrandServices from "./pages/services/BrandServices";

// BRANDS
import BrandDashboard from "./pages/brands/BrandDashboard";
import BrandTools from "./pages/brands/BrandTools";
import APlusContent from "./pages/brands/APlusContent";

// LEARN
import SellerUniversity from "./pages/learn/SellerUniversity";
import TrainingVideos from "./pages/learn/TrainingVideos";
import HowToGuides from "./pages/learn/HowToGuides";

export default function App() {
  const [currentView, setCurrentView] = useState("add-product");

  const renderPage = () => {
    switch (currentView) {
      case "add-product": return <AddProduct />;
      case "upload-products": return <AddProductsUpload />;
      case "drafts": return <Drafts />;
      case "applications": return <Applications />;
      case "upload-images": return <UploadImages />;
      case "upload-videos": return <UploadVideos />;
      case "inventory": return <Inventory />;

      // INVENTORY
      case "manage-inventory": return <ManageInventory />;
      case "manage-fba": return <ManageFBA />;
      case "planning": return <Planning />;
      case "restock": return <Restock />;

      // PRICING
      case "manage-pricing": return <ManagePricing />;
      case "auto-pricing": return <AutoPricing />;
      case "fee-discounts": return <FeeDiscounts />;

      // ORDERS
      case "manage-orders": return <ManageOrders />;
      case "return-requests": return <ReturnRequests />;
      case "cancelled-orders": return <CancelledOrders />;
      case "shipment-reports": return <ShipmentReports />;

      // ADVERTISING
      case "campaign-manager": return <CampaignManager />;
      case "create-campaign": return <CreateCampaign />;
      case "sponsored-products": return <SponsoredProducts />;
      case "sponsored-brands": return <SponsoredBrands />;
      case "sponsored-display": return <SponsoredDisplay />;

      // GROWTH
      case "growth-opportunities": return <GrowthOpportunities />;
      case "brand-analytics": return <BrandAnalytics />;
      case "deals": return <Deals />;
      case "coupons": return <Coupons />;

      // REPORTS
      case "business-reports": return <BusinessReports />;
      case "inventory-reports": return <InventoryReports />;
      case "return-reports": return <ReturnReports />;
      case "payment-reports": return <PaymentReports />;

      // PAYMENTS
      case "payment-summary": return <PaymentSummary />;
      case "transaction-view": return <TransactionView />;
      case "invoice-reports": return <InvoiceReports />;

      // PERFORMANCE
      case "account-health": return <AccountHealth />;
      case "customer-feedback": return <CustomerFeedback />;
      case "delivery-performance": return <DeliveryPerformance />;

      // PARTNER NETWORK
      case "service-providers": return <ServiceProviders />;
      case "amazon-partners": return <AmazonPartners />;
      case "integration-tools": return <IntegrationTools />;

      // SERVICES
      case "fba-services": return <FbaServices />;
      case "logistics": return <Logistics />;
      case "product-photos": return <ProductPhotos />;
      case "brand-services": return <BrandServices />;

      // BRANDS
      case "brand-dashboard": return <BrandDashboard />;
      case "brand-tools": return <BrandTools />;
      case "a-plus-content": return <APlusContent />;

      // LEARN
      case "seller-university": return <SellerUniversity />;
      case "training-videos": return <TrainingVideos />;
      case "how-to-guides": return <HowToGuides />;

      default:
        return <h1>Page Not Found</h1>;
    }
  };

  return (
    <Dashboard currentView={currentView} setCurrentView={setCurrentView}>
      {renderPage()}
    </Dashboard>
  );
}






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
