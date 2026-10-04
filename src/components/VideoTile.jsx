import "./VideoTile.css";

const VideoTile = ({
  stream,
  muted,
  label,
  cameraOff = false,
}) => {
  return (
    <div className="video-tile">

      {!cameraOff && stream ? (
        <video
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
          autoPlay
          playsInline
          muted={muted}
        />
      ) : (
        <div className="camera-off">
          <div className="avatar">
            {label?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="video-info">
        <span>{label}</span>
        <span>🎤</span>
      </div>

    </div>
  );
};

export default VideoTile;