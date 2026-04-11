import { useRef, useState } from "react";

const CameraCapture = ({ register, setValue }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsCameraOn(true);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    // react-hook-form me set karna
    setValue("photo", imageData);
  };

  return (
    <div className="inputBox">
      <label>Photo</label>

      {!isCameraOn && (
        <button type="button" onClick={startCamera} className="btn">
          Open Camera
        </button>
      )}

      <video ref={videoRef} autoPlay className="w-full mt-2 rounded" />

      <canvas ref={canvasRef} className="hidden" />

      {isCameraOn && (
        <button type="button" onClick={capturePhoto} className="btn mt-2">
          Capture
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
