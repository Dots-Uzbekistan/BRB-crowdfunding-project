import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import Registration from "./components/Registration/Registration";
import VerifyIdentity from "./components/VerifyIndentity/VerifyIdentity";
import LastRegistration from "./components/LastRegistration/LastRegistration";
import LoginForm from "./components/LoginForm/LoginForm";
import CampaignDashboard from "./components/CampaignDashboard/CampaignDashboard";
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
        <Route path="/registration" element={<Registration />} />
        <Route path="/verifyidentity" element={<VerifyIdentity />} />
        <Route path="/lastregistration" element={<LastRegistration />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<CampaignDashboard />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
