import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import MainLayout from "../Layouts/MainLayout";
import HomeSinglePage from "../Pages/HomeSinglePage";
import AdminLayout from "../Layouts/AdminLayout";
import AdminWelcome from "../Components/AdminPageComponents/AdminWelcome";
import AdminCampaignList from "../Components/AdminPageComponents/AdminCampaignList";
import AdminCreateCampaign from "../Components/AdminPageComponents/AdminCreateCampaign";
import AdminEdit from "../Components/AdminPageComponents/AdminEdit";
import AdminDonorsList from "../Components/AdminPageComponents/AdminDonorsList";
import PaymentPage from "../Components/PaymentPage";
import AdminLogin from "../Components/AdminPageComponents/AdminLogin";
import Private from "../Private/Private";
const AllRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/single/:id" element={<HomeSinglePage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
      </Route>

        <Route path="/admin" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/welcome" element={<Private><AdminWelcome /></Private>} />
        <Route path="/admin/campaignlist" element={<Private><AdminCampaignList /></Private>} />
        <Route path="/admin/createcampaign" element={<Private><AdminCreateCampaign /></Private>} />
        <Route path="/admin/campaignedit/:id" element={<Private><AdminEdit /></Private>} />
        <Route path="/admin/donorsList" element={<Private><AdminDonorsList /></Private>} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
