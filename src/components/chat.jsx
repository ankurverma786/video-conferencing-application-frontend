import { useEffect, useState } from "react";
import socket from "../services/socket";
import "./Chat.css";

const Chat = ({ meetingId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceiveMessage = ({ sender, message }) => {
      setMessages((prev) => [
        ...prev,
        {
          message,
          own: false,
        },
      ]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      meetingId,
      message,
    });

    setMessages((prev) => [
      ...prev,
      {
        message,
        own: true,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        💬 Meeting Chat
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.own
                ? "message own-message"
                : "message"
            }
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage}>
          ➤
        </button>
      </div>

    </div>
  );
};

export default Chat;