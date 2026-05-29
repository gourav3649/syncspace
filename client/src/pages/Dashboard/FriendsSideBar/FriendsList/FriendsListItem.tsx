import React from "react";
import { useDispatch } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Avatar from "../../../../components/Avatar";
import { setChosenChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";
import { styled, keyframes } from "@mui/system";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
`;

const ItemButton = styled("button")<{ active: boolean }>((props) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: props.active
        ? "rgba(91,115,255,0.14)"
        : "transparent",
    transition: "all 0.15s ease",
    textAlign: "left",
    marginBottom: "2px",
    position: "relative",
    "&:hover": {
        background: props.active
            ? "rgba(91,115,255,0.2)"
            : "#232C3A",
    },
}));

const ActiveBar = styled("div")({
    position: "absolute",
    left: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "60%",
    borderRadius: "0 4px 4px 0",
    background: "#5B73FF",
});

const OnlineDot = styled("div")({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22C55E",
    flexShrink: 0,
    marginLeft: "auto",
    animation: `${pulse} 2s ease-in-out infinite`,
});

const OfflineDot = styled("div")({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    flexShrink: 0,
    marginLeft: "auto",
});

interface FriendsListItemProps {
    id: string;
    username: string;
    email: string;
    isOnline: boolean;
}

const FriendsListItem = ({ id, username, isOnline, email }: FriendsListItemProps) => {
    const dispatch = useDispatch();
    const { chosenChatDetails, typing } = useAppSelector((state) => state.chat);

    const isTyping = typing.find((item) => item.userId === id);
    const isFriendTyping = isTyping && isTyping.typing && id !== chosenChatDetails?.userId;
    const isChatActive = chosenChatDetails?.userId === id;

    return (
        <ItemButton
            active={isChatActive}
            onClick={() => dispatch(setChosenChatDetails({ userId: id, username }))}
            title={email}
        >
            {isChatActive && <ActiveBar />}
            <Avatar username={username} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <Typography
                    style={{
                        fontWeight: isChatActive ? 700 : 500,
                        color: isChatActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.3,
                    }}
                >
                    {username}
                </Typography>
                {isFriendTyping && (
                    <Typography
                        style={{
                            fontSize: "11px",
                            color: "#57F287",
                            lineHeight: 1.2,
                        }}
                    >
                        typing...
                    </Typography>
                )}
                {!isFriendTyping && (
                    <Typography
                        style={{
                            fontSize: "11px",
                            color: isOnline ? "#57F287" : "rgba(255,255,255,0.3)",
                            lineHeight: 1.2,
                        }}
                    >
                        {isOnline ? "Online" : "Offline"}
                    </Typography>
                )}
            </div>
            {isOnline ? <OnlineDot /> : <OfflineDot />}
        </ItemButton>
    );
};

export default FriendsListItem;
