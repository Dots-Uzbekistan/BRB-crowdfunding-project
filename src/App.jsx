import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import Registration from "./pages/Registeration/Registeration";
import TermsConditions from "./subcomponents/TermsConditions/TermsConditions";
import FullRegister from "./subcomponents/FullRegister/FullRegister";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/registeration" element={<Registration />} />
        <Route path="/termsandconditions" element={<TermsConditions />} />
        <Route path="/fullregister" element={<FullRegister />} />
      </Routes>
    </>
  );
}

export default App;
