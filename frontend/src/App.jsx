import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import Registration from "./components/Registration/Registration";
import VerifyIdentity from "./components/VerifyIndentity/VerifyIdentity";
import LastRegistration from "./components/LastRegistration/LastRegistration";
import LoginForm from "./components/LoginForm/LoginForm";
import CampaignDashboard from "./components/CampaignDashboard/CampaignDashboard";
import Profile from "./components/Profile/Profile";
import Settings from "./components/Settings/Settings";
import CampaignDetail from "./components/CampaignDetail/CampaignDetail";
import Payment from "./pages/Payment/Payment";
import AddCampaign from "./campaignpages/AddCampaign/AddCampaign";
import AddDetailsFirst from "./campaignpages/AddDetailsFirst/AddDetailsFirst";
import FullDashboard from "./campaignpages/FullDashboard/FullDashboard";
import EditCampaign from "./campaignpages/EditCampaign/EditCampaign";
import CampaignStats from "./components/CampaignStats/CampaignStats";
import UpdateCampaign from "./components/UpdateCampaign/UpdateCampaign";
export const AuthContext = createContext();
function App() {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [user, setUser] = useState({ name: "", email: "" });
  return (
    <AuthContext.Provider
      value={{
        isSuccessful,
        setIsSuccessful,
        redirectPath,
        setRedirectPath,
        user,
        setUser,
      }}
    >
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/payment/:campaign_id" element={<Payment />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/verifyidentity" element={<VerifyIdentity />} />
        <Route path="/lastregistration" element={<LastRegistration />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<CampaignDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/addcampaign" element={<AddCampaign />} />
        <Route path="/firstadditioncampaign" element={<AddDetailsFirst />} />
        <Route path="/fulldashboard" element={<FullDashboard />} />
        <Route path="/editcampaign/:id" element={<EditCampaign />} />
        <Route path="/stats/:campaignId" element={<CampaignStats />} />
        <Route path="/update/:id" element={<UpdateCampaign />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
