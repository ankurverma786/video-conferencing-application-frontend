import { BrowserRouter, Routes, Route } from "react-router-dom";
import Meeting from "./Pages/Meeting";


import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
        path="/meeting/:roomCode"
        element={
        <ProtectedRoute>
        <Meeting />
        </ProtectedRoute>
        }
      />
      </Routes>


    </BrowserRouter>
  );
}

export default App;