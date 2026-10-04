import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/login";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;