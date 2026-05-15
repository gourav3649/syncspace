import React, { useEffect, useRef } from "react";
import { styled } from "@mui/system";

const Wrapper = styled("div")({
    background: "#111214",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
});

const LocalLabel = styled("span")({
    position: "absolute",
    bottom: "8px",
    left: "10px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    background: "rgba(0,0,0,0.5)",
    borderRadius: "4px",
    padding: "2px 6px",
    backdropFilter: "blur(4px)",
});

const VideoEl = styled("video")({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    borderRadius: "10px",
    backgroundColor: "#111214",
});

const Video: React.FC<{
    stream: MediaStream;
    isLocalStream: boolean;
    dimensions: { x: number; y: number };
}> = ({ stream, isLocalStream, dimensions }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            if (isLocalStream) {
                video.muted = true;
                video.volume = 0;
            }
        };
    }, [stream, isLocalStream]);

    return (
        <Wrapper style={{ width: dimensions.x, height: dimensions.y }}>
            <VideoEl ref={videoRef} autoPlay muted={isLocalStream} />
            {isLocalStream && <LocalLabel>You</LocalLabel>}
        </Wrapper>
    );
};

export default Video;
