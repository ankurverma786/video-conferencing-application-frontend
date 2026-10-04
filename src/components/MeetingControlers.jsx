import './MeetingControlers.css';

const MeetingControls = ({
  stream,
  muted,
  setMuted,
  cameraOff,
  setCameraOff,
  onLeave,
  onScreenShare,
}) => {
  const toggleMute = () => {
    const track = stream?.getAudioTracks()[0];

    if (!track) return;

    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  const toggleCamera = () => {
    const track = stream?.getVideoTracks()[0];

    if (!track) return;

    track.enabled = !track.enabled;
    setCameraOff(!track.enabled);
  };

  return (
    <div className="controls">
     <button
  className={`control-btn ${muted ? "active" : ""}`}
  onClick={toggleMute}
>
  {muted ? "🔇" : "🎤"}
</button>

<button
  className={`control-btn ${cameraOff ? "active" : ""}`}
  onClick={toggleCamera}
>
  {cameraOff ? "📹" : "📷"}
</button>

<button
  className="control-btn"
  onClick={onScreenShare}
>
  🖥️
</button>

<button
  className="leave-btn"
  onClick={onLeave}
>
  📞
</button>
    </div>
  );
};

export default MeetingControls;