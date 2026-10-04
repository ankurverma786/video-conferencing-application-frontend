import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../Services/api";

import "./Home.css";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const joinMeeting = () => {
    if (!roomCode.trim()) return;

    navigate(`/meeting/${roomCode.trim()}`);
  };

  const handleCreateMeeting = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const data = await createRoom(
      "My Meeting",
      token
    );

    navigate(`/meeting/${data.room.roomCode}`);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="home-container">

      <div className="home-navbar">
  <h2>🎥 MeetHub</h2>

  {token ? (
    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      Logout
    </button>
  ) : (
    <div className="auth-buttons">
      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  )}
</div>
      
      <div className="home-card">
    
        <div className="logo">🎥</div>

        <h1>MeetHub</h1>

        <p>Start or join a video meeting</p>

        <input
          type="text"
          placeholder="Enter meeting code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button onClick={joinMeeting}>
          Join Meeting
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="create-btn"  onClick={handleCreateMeeting}>
          Create Meeting
        </button>

      </div>
    </div>
  );
};

export default Home;