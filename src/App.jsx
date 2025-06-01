import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "./auth/Signin";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./context/PrivateRoute";
import Signup from "./auth/SIgnup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protect ChatPage */}
        <Route element={<PrivateRoute />}>
          <Route path="/ChatPage" element={<ChatPage />} />
        </Route>

        {/* Redirect unknown routes to signin */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
