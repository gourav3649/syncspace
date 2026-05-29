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
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: props.active ? "rgba(91,115,255,0.14)" : "transparent",
    transition: "all 0.15s ease",
    textAlign: "left",
    marginBottom: "2px",
    position: "relative",
    "&:hover": {
        background: props.active ? "rgba(91,115,255,0.2)" : "#232C3A",
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

const GroupIcon = styled("div")({
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(91,115,255,0.2) 0%, rgba(91,115,255,0.05) 100%)",
    border: "1px solid rgba(91,115,255,0.2)",
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
                <GroupsIcon sx={{ fontSize: 18, color: "#5B73FF" }} />
            </GroupIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
                <Typography style={{ fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? "#F5F7FB" : "rgba(255,255,255,0.65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chat.groupName}
                </Typography>
                <Typography style={{ fontSize: "12px", color: "#7D8795" }}>
                    {chat.participants?.length === 1 ? "1 member" : `${chat.participants?.length ?? 0} members`}
                </Typography>
            </div>
        </ItemButton>
    );
};

export default GroupChatListItem;
