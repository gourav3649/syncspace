import React from "react";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Tooltip from "@mui/material/Tooltip";
import { useAppSelector } from "../../../store";
import { clearVideoChat } from "../../../actions/videoChatActions";
import { notifyChatLeft } from "../../../socket/socketConnection";
import { leaveRoom } from "../../../socket/roomHandler";

type CallType = "DIRECT CALL" | "ROOM";

const CloseRoom = ({ type }: { type: CallType }) => {
    const dispatch = useDispatch();
    const { videoChat: { otherUserId } } = useAppSelector((state) => state);

    const handleLeave = () => {
        if (type === "DIRECT CALL") {
            if (otherUserId) notifyChatLeft(otherUserId);
            dispatch(clearVideoChat("You left the call"));
        }
        if (type === "ROOM") {
            leaveRoom();
        }
    };

    return (
        <Tooltip title="End call">
            <IconButton
                onClick={handleLeave}
                sx={{
                    color: "#ffffff",
                    background: "linear-gradient(135deg, #ED4245 0%, #C62828 100%)",
                    borderRadius: "10px",
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 4px 12px rgba(237,66,69,0.4)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        background: "linear-gradient(135deg, #C62828 0%, #b71c1c 100%)",
                        transform: "scale(1.05)",
                    },
                }}
            >
                <CallEndIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </Tooltip>
    );
};

export default CloseRoom;
