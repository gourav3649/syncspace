import React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import GroupsIcon from "@mui/icons-material/Groups";
import { setChosenGroupChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";
import { GroupChatDetails } from "../../../../actions/types";

interface Props {
    chat: GroupChatDetails;
}

const ItemButton = styled("button")<{ active: boolean }>((props) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: props.active ? "rgba(88,101,242,0.2)" : "transparent",
    transition: "all 0.15s ease",
    textAlign: "left",
    marginBottom: "2px",
    position: "relative",
    "&:hover": {
        background: props.active ? "rgba(88,101,242,0.25)" : "rgba(255,255,255,0.06)",
    },
}));

const ActiveBar = styled("div")({
    position: "absolute",
    left: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "3px",
    height: "60%",
    borderRadius: "0 2px 2px 0",
    background: "#5865F2",
});

const GroupIcon = styled("div")({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #EB459E 0%, #AD1457 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
});

const GroupChatListItem = ({ chat }: Props) => {
    const dispatch = useDispatch();
    const { chosenGroupChatDetails } = useAppSelector((state) => state.chat);
    const isActive = chosenGroupChatDetails?.groupId === chat.groupId;

    return (
        <ItemButton active={isActive} onClick={() => dispatch(setChosenGroupChatDetails(chat))}>
            {isActive && <ActiveBar />}
            <GroupIcon>
                <GroupsIcon sx={{ fontSize: 16, color: "white" }} />
            </GroupIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
                <Typography style={{ fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chat.groupName}
                </Typography>
                <Typography style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {chat.participants?.length ?? 0} members
                </Typography>
            </div>
        </ItemButton>
    );
};

export default GroupChatListItem;
