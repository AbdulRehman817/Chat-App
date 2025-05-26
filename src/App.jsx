import { useAuth } from "./context/AuthContext";
import Signup from "./auth/SIgnup";
import Signin from "./auth/Signin";
import ChatPage from "./pages/ChatPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // ✅ use `react-router-dom`

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Home route - redirect to chat if logged in */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/ChatPage" />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        {/* Protected chat route */}
        <Route
          path="/ChatPage"
          element={currentUser ? <ChatPage /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
