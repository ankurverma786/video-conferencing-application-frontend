import { useEffect, useState } from "react";

const useMediaStream = () => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        setStream(mediaStream);
      } catch (error) {
        console.error("Camera/Mic error:", error);
      }
    };

    startMedia();

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  return stream;
};

export default useMediaStream;