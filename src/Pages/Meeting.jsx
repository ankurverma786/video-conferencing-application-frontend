import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import Chat from "../components/chat";
import MeetingControls from "../components/MeetingControlers";
import socket from "../services/socket";
import { joinMeeting } from "../Services/api";
import useMediaStream from "../hooks/useMediaStream";
import useWebRTC from "../hooks/useWebRTC";
import VideoGrid from "../components/VideoGrid";

import "./Meeting.css";

const Meeting = () => {
  const { roomCode } = useParams();

  const [remoteStreams, setRemoteStreams] = useState({});

  const stream = useMediaStream();

  const [cameraOff, setCameraOff] = useState(false);

  const [muted, setMuted] = useState(false);

  const [meetingId, setMeetingId] = useState(null);

  const [screenSharing, setScreenSharing] = useState(false);


  const {
    peerConnections,
    createPeerConnection,
  } = useWebRTC(stream);


  const startScreenShare = async () => {
  try {
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

    const screenTrack = screenStream.getVideoTracks()[0];

    Object.values(peerConnections.current).forEach((peer) => {
      const sender = peer
        .getSenders()
        .find(
          (sender) =>
            sender.track?.kind === "video"
        );

      if (sender) {
        sender.replaceTrack(screenTrack);
      }
    });

    setScreenSharing(true);

    screenTrack.onended = () => {
      stopScreenShare();
    };
  } catch (error) {
    console.error("Screen share error:", error);
  }
};


  const stopScreenShare = () => {
  const cameraTrack = stream?.getVideoTracks()[0];

  if (!cameraTrack) return;

  Object.values(peerConnections.current).forEach((peer) => {
    const sender = peer
      .getSenders()
      .find(
        (sender) =>
          sender.track?.kind === "video"
      );

    if (sender) {
      sender.replaceTrack(cameraTrack);
    }
  });

  setScreenSharing(false);
};

  const leaveMeeting = () => {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });

  Object.values(peerConnections.current).forEach((peer) => {
    peer.close();
  });

  peerConnections.current = {};

  if (socket.connected) {
    socket.disconnect();
  }

  window.location.href = "/";
};

  

  useEffect(() => {
    const startMeeting = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("Please login first");
          return;
        }
        setRemoteStreams({});

        const data = await joinMeeting(roomCode, token);

        setMeetingId(data.meetingId);

        console.log("Meeting joined:", data);

        socket.auth = { token };
        

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);

          socket.emit("join-room", data.meetingId);
        });

        socket.on("existing-users", async (users) => {

          console.log("Existing users:", users);
          console.log("Existing users count:", users.length);

          for (const socketId of users) {
            if (peerConnections.current[socketId]) {
            continue;
         }
            const peer = createPeerConnection(socketId);

            peer.onicecandidate = (event) => {
              if (event.candidate) {
                socket.emit("ice-candidate", {
                  target: socketId,
                  candidate: event.candidate,
                });
              }
            };

            peer.ontrack = (event) => {
              setRemoteStreams((prev) => ({
                ...prev,
                [socketId]: event.streams[0],
              }));
            };

            const offer = await peer.createOffer();

            await peer.setLocalDescription(offer);

            socket.emit("offer", {
              target: socketId,
              offer,
            });
          }
        });

        socket.on("offer", async ({ sender, offer }) => {
          const peer = createPeerConnection(sender);

          peer.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice-candidate", {
                target: sender,
                candidate: event.candidate,
              });
            }
          };

          peer.ontrack = (event) => {
            setRemoteStreams((prev) => ({
              ...prev,
              [sender]: event.streams[0],
            }));
          };

          await peer.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          const answer = await peer.createAnswer();

          await peer.setLocalDescription(answer);

          socket.emit("answer", {
            target: sender,
            answer,
          });
        });

        socket.on("answer", async ({ sender, answer }) => {
  const peer = peerConnections.current[sender];

  if (
    peer &&
    peer.signalingState === "have-local-offer"
  ) {
    await peer.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }
});

        socket.on("ice-candidate", async ({ sender, candidate }) => {
          const peer = peerConnections.current[sender];

          if (peer && candidate) {
            await peer.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        });

        socket.on("user-joined", ({ socketId }) => {
          console.log("New user joined:", socketId);
        });
        socket.connect();
      } catch (error) {
        console.error("Meeting error:", error);
      }
    };

    socket.on("user-left", ({ socketId }) => {
  console.log("User left:", socketId);

  const peer = peerConnections.current[socketId];

  if (peer) {
    peer.close();
    delete peerConnections.current[socketId];
  }

  setRemoteStreams((prev) => {
    const updated = { ...prev };
    delete updated[socketId];
    return updated;
  });
});

    if (stream) {
      startMeeting();
    }

    return () => {

      socket.removeAllListeners();

      Object.values(peerConnections.current).forEach((peer) => {
        peer.close();
      });

      peerConnections.current = {};

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [roomCode, stream]);

























  

  return (
  <div className="meeting-container">

    <header className="meeting-header">
      <h2>🎥 Video Meeting</h2>
      <span>Room: {roomCode}</span>
    </header>

    <main className="meeting-main">

      <section className="video-section">
        <VideoGrid
          localStream={stream}
          remoteStreams={remoteStreams}
           cameraOff={cameraOff}
        />
      </section>

      <aside className="chat-section">
        {meetingId && (
          <Chat meetingId={meetingId} />
        )}
      </aside>

    </main>

    <footer className="controls-section">
      <MeetingControls
        stream={stream}
        muted={muted}
        setMuted={setMuted}
        cameraOff={cameraOff}
        setCameraOff={setCameraOff}
        onLeave={leaveMeeting}
        onScreenShare={
    screenSharing
      ? stopScreenShare
      : startScreenShare
        }
      />
    </footer>

  </div>
);
};

export default Meeting;