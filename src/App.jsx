import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFab from "./components/WhatsAppFab";
import Home from "./pages/Home";
import Mediator from "./pages/Mediator";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollTop />
      <Header />
      <main key={pathname} className="flex-1 page-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mediator" element={<Mediator />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/buyer" element={<Buyer />} />
          {/* Hidden admin routes — not linked from anywhere in the UI */}
          <Route path="/control" element={<AdminLogin />} />
          <Route path="/control/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
