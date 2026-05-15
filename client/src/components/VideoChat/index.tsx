import React, { useState } from "react";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResizeRoomButton from "./ResizeRoomButton";
import VideosContainer from "./VideosContainer";
import RoomButtons from "./RoomButtons";

const drawerWidth = 240;

const Overlay = styled("div")({
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    background: "#111214",
    overflow: "hidden",
    zIndex: 200,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "-8px 8px 32px rgba(0,0,0,0.5)",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
});

const VideoChat = () => {
    // Start maximized by default so video fills properly without scroll
    const [isRoomMinimized, setIsRoomMinimized] = useState(false);
    const matches = useMediaQuery("(max-width:800px)");

    const minimizedStyle: React.CSSProperties = {
        width: matches ? "70vw" : "340px",
        height: "260px",
        borderRadius: "0 0 0 16px",
    };

    const fullscreenStyle: React.CSSProperties = {
        width: matches ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        height: "100vh",
        borderRadius: 0,
    };

    return (
        <Overlay style={isRoomMinimized ? minimizedStyle : fullscreenStyle}>
            <VideosContainer isRoomMinimized={isRoomMinimized} />
            <RoomButtons
                isRoomMinimized={isRoomMinimized}
                handleRoomResize={() => setIsRoomMinimized(!isRoomMinimized)}
            />
        </Overlay>
    );
};

export default VideoChat;
