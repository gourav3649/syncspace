import React, { useRef } from "react";
import { styled } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "../../../../components/Avatar";
import { useAppSelector } from "../../../../store";
import { callRequest } from "../../../../socket/socketConnection";
import ChatDropDown from "./ChatDropDown";
import Typography from "@mui/material/Typography";

const HeaderBar = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "56px",
    background: "#313338",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 20,
});

const UserInfo = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
});

const Actions = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
});

const CallBtn = styled(IconButton)({
    color: "rgba(255,255,255,0.6)",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    "&:hover": {
        color: "#57F287",
        background: "rgba(87,242,135,0.1)",
    },
    "&:disabled": {
        color: "rgba(255,255,255,0.2)",
    },
});

const VideoBtn = styled(IconButton)({
    color: "rgba(255,255,255,0.6)",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    "&:hover": {
        color: "#5865F2",
        background: "rgba(88,101,242,0.1)",
    },
    "&:disabled": {
        color: "rgba(255,255,255,0.2)",
    },
});

const OnlineBadge = styled("span")<{ online?: boolean }>((props) => ({
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: props.online ? "#57F287" : "rgba(255,255,255,0.25)",
    flexShrink: 0,
}));

const MessagesHeader: React.FC<{ scrollPosition: number }> = ({ scrollPosition }) => {
    const { auth: { userDetails }, chat: { chosenChatDetails, chosenGroupChatDetails }, room: { isUserInRoom } } = useAppSelector((state) => state);
    const { onlineUsers } = useAppSelector(s => s.friends);

    const isOnline = chosenChatDetails
        ? !!onlineUsers.find(u => u.userId === chosenChatDetails.userId)
        : false;

    const displayName = chosenChatDetails?.username || chosenGroupChatDetails?.groupName || "";

    return (
        <HeaderBar>
            <UserInfo>
                {displayName && <Avatar username={displayName} />}
                <div>
                    <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "15px", lineHeight: 1.2 }}>
                        {displayName}
                    </Typography>
                    {chosenChatDetails && (
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <OnlineBadge online={isOnline} />
                            {isOnline ? "Online" : "Offline"}
                        </Typography>
                    )}
                    {chosenGroupChatDetails && (
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                            {chosenGroupChatDetails.participants?.length ?? 0} members
                        </Typography>
                    )}
                </div>
            </UserInfo>

            <Actions>
                {chosenChatDetails && (
                    <>
                        <CallBtn
                            disabled={isUserInRoom}
                            onClick={() => callRequest({ audioOnly: true, callerName: userDetails?.username ?? "", receiverUserId: chosenChatDetails.userId! })}
                            title="Voice Call"
                        >
                            <CallIcon sx={{ fontSize: 20 }} />
                        </CallBtn>
                        <VideoBtn
                            disabled={isUserInRoom}
                            onClick={() => callRequest({ audioOnly: false, callerName: userDetails?.username ?? "", receiverUserId: chosenChatDetails.userId! })}
                            title="Video Call"
                        >
                            <VideoCallIcon sx={{ fontSize: 22 }} />
                        </VideoBtn>
                    </>
                )}
                <ChatDropDown />
            </Actions>
        </HeaderBar>
    );
};

export default MessagesHeader;
