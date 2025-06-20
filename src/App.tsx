import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import OnlineUsers from "./components/OnlineUsers";

//styles
import "./App.css";

// pages and components
import Dashboard from "./pages/dashboard/Dashboard";
import Create from "./pages/create/Create";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Project from "./pages/project/Project";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  !user ? <Navigate to="/login" replace /> : <Dashboard />
                }
              />

              <Route
                path="/create"
                element={!user ? <Navigate to="/login" replace /> : <Create />}
              />

              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" replace />}
              />

              <Route path="/signup" element={<Signup />} />

              <Route
                path="/project/:id"
                element={!user ? <Navigate to="/login" replace /> : <Project />}
              />
            </Routes>
          </div>
          {user && <OnlineUsers></OnlineUsers>}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
