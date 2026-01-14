import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import MyGigs from "./pages/dashboard/MyGigs";
import MyBids from "./pages/dashboard/MyBids";
import PostGig from "./pages/gigs/PostGig";
import GigDetails from "./pages/gigs/GigDetails";
import AppLayout from "./layouts/AppLayout";
import { ToastContainer } from 'react-toastify';  


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-gigs" element={<MyGigs />} />
            <Route path="/my-bids" element={<MyBids />} />
            <Route path="/post" element={<PostGig />} />
            <Route path="/gig/:id" element={<GigDetails />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}