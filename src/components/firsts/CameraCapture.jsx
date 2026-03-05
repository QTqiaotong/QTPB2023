import React, { useRef, useState, useCallback, useEffect } from 'react';
import './FirstsTimeline.css';

export default function CameraCapture({ onCapture, onCancel }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError('无法访问摄像头，请确保浏览器已授权并运行在 HTTPS 环境中。');
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capture = useCallback(() => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        // Mirror the canvas context if front camera is used (usually mirrored by default in video)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert back to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
    }, [stream, onCapture]);

    return (
        <div className="camera-capture-container">
            {error ? (
                <div className="camera-error">
                    <p>{error}</p>
                    <button type="button" onClick={onCancel} className="btn-cancel-camera">返回</button>
                </div>
            ) : (
                <div className="camera-view">
                    <video ref={videoRef} autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }} />
                    <div className="camera-controls">
                        <button type="button" className="btn-capture" onClick={capture}></button>
                        <button type="button" className="btn-cancel-camera" onClick={onCancel}>取消</button>
                    </div>
                </div>
            )}
        </div>
    );
}
