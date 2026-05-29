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
    padding: "0 24px",
    height: "64px",
    background: "#171C26",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 20,
});

const UserInfo = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
});

const Actions = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
});

const CallBtn = styled(IconButton)({
    color: "#B8C0CC",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    "&:hover": {
        color: "#22C55E",
        background: "rgba(34,197,94,0.1)",
    },
    "&:disabled": {
        color: "rgba(255,255,255,0.2)",
    },
});

const VideoBtn = styled(IconButton)({
    color: "#B8C0CC",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    "&:hover": {
        color: "#5B73FF",
        background: "rgba(91,115,255,0.1)",
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
    background: props.online ? "#22C55E" : "rgba(255,255,255,0.2)",
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
        <HeaderBar style={{ boxShadow: scrollPosition > 10 ? "0 4px 20px rgba(0,0,0,0.2)" : "none", transition: "box-shadow 0.2s" }}>
            <UserInfo>
                {displayName && <Avatar username={displayName} />}
                <div>
                    <Typography sx={{ color: "#F5F7FB", fontWeight: 600, fontSize: "16px", lineHeight: 1.2 }}>
                        {displayName}
                    </Typography>
                    {chosenChatDetails && (
                        <Typography sx={{ color: "#7D8795", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                            <OnlineBadge online={isOnline} />
                            {isOnline ? "Online" : "Offline"}
                        </Typography>
                    )}
                    {chosenGroupChatDetails && (
                        <Typography sx={{ color: "#7D8795", fontSize: "13px", marginTop: "2px" }}>
                            {chosenGroupChatDetails.participants?.length === 1 ? "1 member" : `${chosenGroupChatDetails.participants?.length ?? 0} members`}
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
