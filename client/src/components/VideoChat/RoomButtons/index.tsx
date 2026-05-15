import React from "react";
import { styled } from "@mui/system";
import Camera from "./Camera";
import Microphone from "./Microphone";
import CloseRoom from "./CloseRoom";
import ScreenShare from "./ScreenShare";
import ResizeRoomButton from "../ResizeRoomButton";
import { useAppSelector } from "../../../store";

const Bar = styled("div")({
    height: "56px",
    width: "100%",
    background: "#111214",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 12px",
    flexShrink: 0,
});

const Divider = styled("div")({
    width: "1px",
    height: "24px",
    background: "rgba(255,255,255,0.1)",
    margin: "0 4px",
});

const RoomButtons: React.FC<{
    isRoomMinimized: boolean;
    handleRoomResize: () => void;
}> = ({ isRoomMinimized, handleRoomResize }) => {
    const { videoChat, room } = useAppSelector((state) => state);

    const buttons = videoChat.localStream ? (
        <Bar>
            {!videoChat.audioOnly && (
                <>
                    <ScreenShare videoChat={videoChat} type="DIRECT CALL" />
                    <Camera localStream={videoChat.localStream} />
                </>
            )}
            <Microphone localStream={videoChat.localStream} />
            <Divider />
            <CloseRoom type="DIRECT CALL" />
            <ResizeRoomButton
                isRoomMinimized={isRoomMinimized}
                handleRoomResize={handleRoomResize}
            />
        </Bar>
    ) : room.localStreamRoom ? (
        <Bar>
            {!room.isUserJoinedWithOnlyAudio && (
                <>
                    <ScreenShare room={room} type="ROOM" />
                    <Camera localStream={room.localStreamRoom} />
                </>
            )}
            <Microphone localStream={room.localStreamRoom} />
            <Divider />
            <CloseRoom type="ROOM" />
            <ResizeRoomButton
                isRoomMinimized={isRoomMinimized}
                handleRoomResize={handleRoomResize}
            />
        </Bar>
    ) : null;

    return <>{buttons}</>;
};

export default RoomButtons;
