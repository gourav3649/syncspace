import React from "react";
import { Typography } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const ICON_MAP: Record<string, JSX.Element> = {
    "Private Messages": <MailOutlineIcon sx={{ fontSize: 14 }} />,
    "Group Chats": <GroupsIcon sx={{ fontSize: 14 }} />,
    "Active Rooms": <VolumeUpIcon sx={{ fontSize: 14 }} />,
    "Invitations": <PersonAddIcon sx={{ fontSize: 14 }} />,
};

const FriendsTitle = ({ title }: { title: string }) => {
    return (
        <Typography
            sx={{
                textTransform: "uppercase",
                color: "#7D8795",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "1px",
                marginTop: "16px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingLeft: "4px",
                userSelect: "none",
            }}
        >
            {ICON_MAP[title] ?? <PeopleAltIcon sx={{ fontSize: 16 }} />}
            {title}
        </Typography>
    );
};

export default FriendsTitle;
