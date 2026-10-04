import { useCallback, useRef } from "react";

const useWebRTC = (stream) => {
  const peerConnections = useRef({});

  const createPeerConnection = useCallback(
    (socketId) => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      stream?.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peerConnections.current[socketId] = peer;

      return peer;
    },
    [stream]
  );

  return {
    peerConnections,
    createPeerConnection,
  };
};

export default useWebRTC;