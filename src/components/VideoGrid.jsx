import VideoTile from "./VideoTile";
import "./VideoGrid.css";

const VideoGrid = ({ localStream, remoteStreams, cameraOff }) => {
  return (
    <div className="video-grid">

      {Object.entries(remoteStreams).map(([socketId, stream]) => (
        <div className="remote-video" key={socketId}>
          <VideoTile
            stream={stream}
            label="Participant"
          />
        </div>
      ))}

      {localStream && (
        <div className="local-video">
          <VideoTile
            stream={localStream}
            muted={true}
            label="You"
            cameraOff={cameraOff}
          />
        </div>
      )}

    </div>
  );
};

export default VideoGrid;
